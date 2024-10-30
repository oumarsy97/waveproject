import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecurringTransferDto {
  @ApiProperty()
  idEmetteur: number;
  @ApiProperty()
  idRecepteur: number;
  @ApiProperty()
  montant: number;
  @ApiProperty()
  jourDuMois: number; // 1-31
  @ApiProperty()
  heure: number; // 0-23
  @ApiProperty()
  minute: number; // 0-59
}

@Injectable()
export class TransfertRecurrentService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecurringTransfer(dto: CreateRecurringTransferDto) {
    // Validation des entrées
    if (dto.jourDuMois < 1 || dto.jourDuMois > 31) {
      throw new Error('Le jour du mois doit être entre 1 et 31');
    }
    if (dto.heure < 0 || dto.heure > 23) {
      throw new Error('L\'heure doit être entre 0 et 23');
    }
    if (dto.minute < 0 || dto.minute > 59) {
      throw new Error('Les minutes doivent être entre 0 et 59');
    }

    // Calculer la prochaine date d'exécution
    const prochainExecutionDate = this.calculateNextExecutionDate(
      dto.jourDuMois,
      dto.heure,
      dto.minute
    );

    return await this.prisma.transfertRecurrent.create({
      data: {
        montant: dto.montant,
        idEmeteur: dto.idEmetteur,
        idRecepteur: dto.idRecepteur,
        jourDuMois: dto.jourDuMois,
        heure: dto.heure,
        minute: dto.minute,
        prochainExecutionDate,
      },
    });
  }

  private calculateNextExecutionDate(jour: number, heure: number, minute: number): Date {
    const now = new Date();
    let nextDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      jour,
      heure,
      minute,
      0
    );

    // Si la date calculée est dans le passé, passer au mois suivant
    if (nextDate <= now) {
      nextDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        jour,
        heure,
        minute,
        0
      );
    }

    // Ajuster si le jour n'existe pas dans le mois (ex: 31 février)
    if (nextDate.getDate() !== jour) {
      nextDate = new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        jour,
        heure,
        minute,
        0
      );
    }

    return nextDate;
  }

  @Cron('* * * * *') // Vérifie chaque minute
  async executeRecurringTransfers() {
    const now = new Date();
    
    const transfertsAExecuter = await this.prisma.transfertRecurrent.findMany({
      where: {
        statut: 'ACTIF',
        prochainExecutionDate: {
          lte: now,
        },
      },
      include: {
        emmeteur: true,
        recepteur: true,
      },
    });


    for (const transfert of transfertsAExecuter) {
      await this.executeRecurringTransfer(transfert);
    }
  }

  private async executeRecurringTransfer(transfert: any) {
    return await this.prisma.$transaction(async (tx) => {
      try {
        // Vérifications
        const emetteur = await tx.compte.findUnique({
          where: { id: transfert.idEmeteur },
        });

        const recepteur = await tx.compte.findUnique({
          where: { id: transfert.idRecepteur },
        });

        if (!emetteur || !recepteur) {
          await this.suspendRecurringTransfer(transfert.id, 'Compte inexistant');
          return;
        }

        if (emetteur.montant < transfert.montant) {
          // Pour les transferts récurrents, on ne les annule pas mais on les suspend
          await this.suspendRecurringTransfer(transfert.id, 'Solde insuffisant');
          return;
        }

        if (recepteur.montant + transfert.montant > recepteur.limiteMensuelle) {
          await this.suspendRecurringTransfer(transfert.id, 'Limite mensuelle atteinte');
          return;
        }

        // Exécuter le transfert
        await tx.compte.update({
          where: { id: transfert.idEmeteur },
          data: { montant: emetteur.montant - transfert.montant * 1.01 }
        });

        await tx.compte.update({
          where: { id: transfert.idRecepteur },
          data: { montant: recepteur.montant + transfert.montant }
        });

        // Créer l'enregistrement de transaction
        await tx.transaction.create({
          data: {
            idEmeteur: transfert.idEmeteur,
            idClient: transfert.idRecepteur,
            montant: transfert.montant,
            statut: 'COMPLETEE',
            frais: transfert.montant * 0.01,
            type: 'TRANSFERT',
            reference: `REC-${transfert.id}-${Date.now()}`,
          }
        });

        // Notifications
        await tx.notification.create({
          data: {
            clientId: transfert.idEmeteur,
            message: `Transfert récurrent exécuté: ${transfert.montant} FCFA à ${recepteur.telephone}`,
            titre: 'Transfert Récurrent',
            type: 'COMPTE'
          }
        });

        await tx.notification.create({
          data: {
            clientId: transfert.idRecepteur,
            message: `Vous avez reçu ${transfert.montant} FCFA de ${emetteur.telephone} (transfert récurrent)`,
            titre: 'Transfert Récurrent',
            type: 'COMPTE'
          }
        });

        // Mettre à jour la date du prochain transfert
        const prochainExecutionDate = this.calculateNextExecutionDate(
          transfert.jourDuMois,
          transfert.heure,
          transfert.minute
        );

        await tx.transfertRecurrent.update({
          where: { id: transfert.id },
          data: {
            dernierExecutionDate: new Date(),
            prochainExecutionDate,
          }
        });

      } catch (error) {
        console.error(`Erreur lors du transfert récurrent ${transfert.id}:`, error);
        await this.suspendRecurringTransfer(transfert.id, error.message);
      }
    });
  }

   async suspendRecurringTransfer(id: number, raison: string) {
    await this.prisma.transfertRecurrent.update({
      where: { id },
      data: {
        statut: 'SUSPENDU',
      }
    });

    // Notifier l'émetteur de la suspension
    const transfert = await this.prisma.transfertRecurrent.findUnique({
      where: { id },
      include: {
        emmeteur: true,
      }
    });

    await this.prisma.notification.create({
      data: {
        clientId: transfert.idEmeteur,
        message: `Votre transfert récurrent a été suspendu. Raison: ${raison}`,
        titre: 'Transfert Récurrent Suspendu',
        type: 'COMPTE'
      }
    });
  }

  async resumeRecurringTransfer(id: number) {
    const transfert = await this.prisma.transfertRecurrent.findUnique({
      where: { id }
    });

    if (!transfert) {
      throw new Error('Transfert récurrent non trouvé');
    }

    const prochainExecutionDate = this.calculateNextExecutionDate(
      transfert.jourDuMois,
      transfert.heure,
      transfert.minute
    );

    return await this.prisma.transfertRecurrent.update({
      where: { id },
      data: {
        statut: 'ACTIF',
        prochainExecutionDate,
      }
    });
  }

  async cancelRecurringTransfer(id: number) {
    return await this.prisma.transfertRecurrent.update({
      where: { id },
      data: {
        statut: 'TERMINE',
      }
    });
  }

  async findAllRecurringTransfers(userId: number) {
    return await this.prisma.transfertRecurrent.findMany({
      where: {
        idEmeteur: userId,
      },
      include: {
        emmeteur: true,
        recepteur: true,
      },
      orderBy: {
        prochainExecutionDate: 'asc',
      }
    });
  }
}