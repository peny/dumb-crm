const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Deal stored procedures
const dealProcedures = {
  // Get all deals
  async getAll() {
    return await prisma.deal.findMany({
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get deal by ID
  async getById(id) {
    return await prisma.deal.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true
      }
    });
  },

  // Get deals by customer ID
  async getByCustomerId(customerId) {
    return await prisma.deal.findMany({
      where: { customerId: parseInt(customerId) },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get deals by status
  async getByStatus(status) {
    return await prisma.deal.findMany({
      where: { status: status },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Create new deal
  async create(dealData) {
    return await prisma.deal.create({
      data: {
        customerId: parseInt(dealData.customerId),
        title: dealData.title,
        description: dealData.description || null,
        value: parseFloat(dealData.value),
        status: dealData.status || 'open'
      },
      include: {
        customer: true
      }
    });
  },

  // Update deal
  async update(id, dealData) {
    return await prisma.deal.update({
      where: { id: parseInt(id) },
      data: {
        title: dealData.title,
        description: dealData.description || null,
        value: parseFloat(dealData.value),
        status: dealData.status || 'open'
      },
      include: {
        customer: true
      }
    });
  },

  // Delete deal
  async delete(id) {
    return await prisma.deal.delete({
      where: { id: parseInt(id) }
    });
  },

  // Get deal statistics
  async getStats() {
    const totalDeals = await prisma.deal.count();
    const openDeals = await prisma.deal.count({ where: { status: 'open' } });
    const wonDeals = await prisma.deal.count({ where: { status: 'won' } });
    const lostDeals = await prisma.deal.count({ where: { status: 'lost' } });
    
    const totalValue = await prisma.deal.aggregate({
      _sum: { value: true }
    });

    const wonValue = await prisma.deal.aggregate({
      where: { status: 'won' },
      _sum: { value: true }
    });

    return {
      totalDeals,
      openDeals,
      wonDeals,
      lostDeals,
      totalValue: totalValue._sum.value || 0,
      wonValue: wonValue._sum.value || 0
    };
  }
};

module.exports = dealProcedures;
