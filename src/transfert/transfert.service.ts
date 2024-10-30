import { Injectable } from '@nestjs/common';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransfertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransfertDto: CreateTransfertDto) {
    const { idEmetteur, idRecepteur, montant } = createTransfertDto;
    // ... reste du code existant ...
  }

  async scheduleTransfert(createTransfertDto: CreateTransfertDto) {
    const { montant, idEmetteur, idRecepteur, dateExecution } = createTransfertDto;
    if (!dateExecution || dateExecution < new Date()) {
      throw new Error('La date d\'exécution doit être future');
    }
      
    // Vérifier si l'émetteur a suffisamment de fonds au moment de la programmation
    const emetteur = await this.prisma.compte.findUnique({
      where: { id: idEmetteur }
    });

    if (!emetteur || emetteur.montant < montant) {
      throw new Error('Solde insuffisant pour programmer ce transfert');
    }

    return this.prisma.trasfertprogramme.create({
      data: {
        montant,
        idRecepteur,
        statut: 'EN_ATTENTE',
        dateExecution,
        idEmeteur: idEmetteur
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async executeScheduledTransfers() {
    try {
      const transfertsAExecuter = await this.prisma.trasfertprogramme.findMany({
        where: {
          statut: 'EN_ATTENTE',
          dateExecution: {
            lte: new Date(),
          },
        },
      });

      for (const transfert of transfertsAExecuter) {
        await this.executeScheduledTransfer(transfert);
      }
    } catch (error) {
      console.error('Erreur lors du traitement des transferts programmés:', error);
    }
  }

  private async executeScheduledTransfer(transfert: any) {
    return await this.prisma.$transaction(async (tx) => {
      try {
        const emetteur = await tx.compte.findUnique({
          where: { id: transfert.idEmeteur },
        });

        const recepteur = await tx.compte.findUnique({
          where: { id: transfert.idRecepteur },
        });

        // Vérifications
        if (!emetteur || !recepteur) {
          await this.updateTransferStatus(transfert.id, 'ECHEC', 'Compte inexistant');
          return;
        }

        if (emetteur.montant < transfert.montant) {
          await this.updateTransferStatus(transfert.id, 'ECHEC', 'Solde insuffisant');
          return;
        }

        if (recepteur.montant + transfert.montant > recepteur.limiteMensuelle) {
          await this.updateTransferStatus(transfert.id, 'ECHEC', 'Limite mensuelle atteinte');
          return;
        }

        // Mise à jour des soldes
        await tx.compte.update({
          where: { id: transfert.idEmeteur },
          data: { montant: emetteur.montant - transfert.montant * 1.01 }
        });

        await tx.compte.update({
          where: { id: transfert.idRecepteur },
          data: { montant: recepteur.montant + transfert.montant }
        });

        // Création de la transaction
        await tx.transaction.create({
          data: {
            idEmeteur: transfert.idEmeteur,
            idClient: transfert.idRecepteur,
            montant: transfert.montant,
            statut: 'COMPLETEE',
            frais: transfert.montant * 0.01,
            type: 'TRANSFERT',
            reference: `PROG-${transfert.id}-${Date.now()}`,
          }
        });

        // Notifications
        await tx.notification.create({
          data: {
            clientId: transfert.idEmeteur,
            message: `Transfert programmé exécuté: ${transfert.montant} FCFA à ${recepteur.telephone}`,
            titre: 'Transfert Programmé',
            type: 'COMPTE'
          }
        });

        await tx.notification.create({
          data: {
            clientId: transfert.idRecepteur,
            message: `Vous avez reçu ${transfert.montant} FCFA de ${emetteur.telephone} (transfert programmé)`,
            titre: 'Transfert Programmé',
            type: 'COMPTE'
          }
        });

        await this.updateTransferStatus(transfert.id, 'VALIDE');
      } catch (error) {
        await this.updateTransferStatus(transfert.id, 'ECHEC', error.message);
        throw error;
      }
    });
  }

  private async updateTransferStatus(id: number, status: string, message?: string) {
    await this.prisma.trasfertprogramme.update({
      where: { id }, 
      data: {
        statut: status as any,
        updatedAt: new Date(),
      },
    });

    if (message) {
      console.error(`Transfert programmé ${id}: ${message}`);
    }
  }

  

  async findAll() {
    return await this.prisma.transaction.findMany({
      include: {
        emeteur: true,
        compte: true
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        emeteur: true,
        compte: true
      }
    });
  }

  //mes transferts et ceux de mon compte
  async findbyCompte(id: number) {
    return await this.prisma.transaction.findMany({
     //recepteur ou emeteur
      where: { OR: [{ idEmeteur: id }, { idClient: id }] },
      include: {
        emeteur: true,
        compte: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id: number, updateTransfertDto: UpdateTransfertDto) {
    return await this.prisma.transaction.update({
      where: { id },
      data: updateTransfertDto
    });
  }

  async remove(id: number) {
    return await this.prisma.transaction.delete({
      where: { id }
    });
  }
}