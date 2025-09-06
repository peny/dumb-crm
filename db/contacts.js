const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Contact stored procedures
const contactProcedures = {
  // Get all contacts
  async getAll() {
    return await prisma.contact.findMany({
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get contact by ID
  async getById(id) {
    return await prisma.contact.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true
      }
    });
  },

  // Get contacts by customer ID
  async getByCustomerId(customerId) {
    return await prisma.contact.findMany({
      where: { customerId: parseInt(customerId) },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Create new contact
  async create(contactData) {
    return await prisma.contact.create({
      data: {
        customerId: parseInt(contactData.customerId),
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        position: contactData.position || null
      },
      include: {
        customer: true
      }
    });
  },

  // Update contact
  async update(id, contactData) {
    return await prisma.contact.update({
      where: { id: parseInt(id) },
      data: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        position: contactData.position || null
      },
      include: {
        customer: true
      }
    });
  },

  // Delete contact
  async delete(id) {
    return await prisma.contact.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = contactProcedures;
