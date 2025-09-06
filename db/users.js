const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// User stored procedures
const userProcedures = {
  // Get all users (admin only)
  async getAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get user by ID
  async getById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  // Get user by email (for login)
  async getByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  },

  // Create new user
  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'user',
        isActive: userData.isActive !== undefined ? userData.isActive : true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  // Update user
  async update(id, userData) {
    const updateData = {
      email: userData.email?.toLowerCase(),
      name: userData.name,
      role: userData.role,
      isActive: userData.isActive
    };

    // Only hash password if provided
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 12);
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  // Delete user
  async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) }
    });
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Check if email exists
  async emailExists(email) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    return !!user;
  },

  // Get user statistics
  async getStats() {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const adminUsers = await prisma.user.count({ where: { role: 'admin' } });
    const regularUsers = await prisma.user.count({ where: { role: 'user' } });

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers
    };
  },

  // Create default admin user (if no users exist)
  async createDefaultAdmin() {
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      return await prisma.user.create({
        data: {
          email: 'admin@dumbcrm.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin',
          isActive: true
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }
    
    return null;
  }
};

module.exports = userProcedures;
