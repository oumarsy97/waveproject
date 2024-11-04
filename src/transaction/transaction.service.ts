import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const { montant, idOperateur, idClient, type } = createTransactionDto;

      // Validation des données
      if (!montant || !idOperateur || !idClient || !type) {
        throw new HttpException('Données manquantes pour la transaction', HttpStatus.BAD_REQUEST);
      }

      if (type !== 'DEPOT' && type !== 'RETRAIT') {
        throw new HttpException('Type de transaction invalide', HttpStatus.BAD_REQUEST);
      }

      if (idOperateur < 0 || idClient < 0 || montant < 0) {
        throw new HttpException('Valeurs négatives non autorisées', HttpStatus.BAD_REQUEST);
      }

      // Vérification de l'existence du client et de l'opérateur
      const [client, operateur] = await Promise.all([
        this.prisma.client.findUnique({
          where: { id: +idClient },
          include: { compte: true }
        }),
        this.prisma.operateur.findUnique({
          where: { id: +idOperateur },
          include: { compte: true }
        })
      ]);

      if (!client || !operateur) {
        throw new HttpException('Client ou opérateur non trouvé', HttpStatus.NOT_FOUND);
      }

      if (!client.compte || !operateur.compte) {
        throw new HttpException('Compte non trouvé', HttpStatus.NOT_FOUND);
      }

      // Génération de la référence
      const reference = `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Exécution de la transaction
      return await this.prisma.$transaction(async (prisma) => {
        if (type === 'DEPOT') {
          // Vérifier le solde de l'opérateur
          if (operateur.compte.montant < montant) {
            throw new HttpException('Solde opérateur insuffisant', HttpStatus.BAD_REQUEST);
          }
          // Vérifier le solde mensuel du client
          if (client.compte.montant + montant > operateur.compte.limiteMensuelle) {
            throw new HttpException('Solde plafond mensuel du client atteint', HttpStatus.BAD_REQUEST);
          }

          // Mise à jour des comptes
          await Promise.all([
            // Créditer le compte client
            prisma.compte.update({
              where: { id: client.compte.id },
              data: { montant: { increment: montant } }
            }),
            // Débiter le compte opérateur
            prisma.compte.update({
              where: { id: operateur.compte.id },
              data: { montant: { decrement: montant } }
            })
          ]);
        } else if (type === 'RETRAIT') {
          // Vérifier le solde du client
          if (client.compte.montant < montant) {
            throw new HttpException('Solde client insuffisant', HttpStatus.BAD_REQUEST);
          }

          // Mise à jour des comptes
          await Promise.all([
            // Débiter le compte client
            prisma.compte.update({
              where: { id: client.compte.id },
              data: { montant: { decrement: montant } }
            }),
            // Créditer le compte opérateur
            prisma.compte.update({
              where: { id: operateur.compte.id },
              data: { montant: { increment: montant } }
            })
          ]);
        }

        // Créer la transaction
        return prisma.transaction.create({
          data: {
            montant,
            idOperateur: +idOperateur,
            idClient: +idClient,
            reference,
            type,
            statut: 'COMPLETEE',
          }
        });
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la création de la transaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.transaction.findMany({
        include: {
          compte: true,
          operateur: true
        }
      });
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des transactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  

  async findOne(id: number) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
        include: {
          compte: true,
          operateur: true
        }
      });

      if (!transaction) {
        throw new HttpException('Transaction non trouvée', HttpStatus.NOT_FOUND);
      }

      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la récupération de la transaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findbyCompte(id: number) {
    try {
      return await this.prisma.transaction.findMany({
        where: { OR: [{ idEmeteur: id }, { idClient: id }] },
        include: {
          compte: {
            include: {
              Client: true
            }
          },
          operateur: {
            select: {
              nom: true,
              prenom: true
            } 
          },
          emeteur: {
            include: {
              Client: true
            }
          },
          
          

        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la sélection des transactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
      
  
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id }
      });

      if (!transaction) {
        throw new HttpException('Transaction non trouvée', HttpStatus.NOT_FOUND);
      }

      if (transaction.statut === 'COMPLETEE') {
        throw new HttpException('Impossible de modifier une transaction complétée', HttpStatus.BAD_REQUEST);
      }

      return await this.prisma.transaction.update({
        where: { id },
        data: updateTransactionDto,
        include: {
          compte: true,
          operateur: true
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la mise à jour de la transaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id }
      });

      if (!transaction) {
        throw new HttpException('Transaction non trouvée', HttpStatus.NOT_FOUND);
      }

      if (transaction.statut === 'COMPLETEE') {
        throw new HttpException('Impossible de supprimer une transaction complétée', HttpStatus.BAD_REQUEST);
      }

      return await this.prisma.transaction.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la suppression de la transaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}