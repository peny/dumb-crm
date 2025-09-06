const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Customer stored procedures
const customerProcedures = {
  // Get all customers
  async getAll() {
    return await prisma.customer.findMany({
      include: {
        contacts: true,
        deals: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get customer by ID
  async getById(id) {
    return await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        contacts: true,
        deals: true
      }
    });
  },

  // Create new customer
  async create(customerData) {
    return await prisma.customer.create({
      data: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || null,
        company: customerData.company || null
      },
      include: {
        contacts: true,
        deals: true
      }
    });
  },

  // Update customer
  async update(id, customerData) {
    return await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || null,
        company: customerData.company || null
      },
      include: {
        contacts: true,
        deals: true
      }
    });
  },

  // Delete customer
  async delete(id) {
    return await prisma.customer.delete({
      where: { id: parseInt(id) }
    });
  },

  // Search customers
  async search(query) {
    return await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        contacts: true,
        deals: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
};

module.exports = customerProcedures;
