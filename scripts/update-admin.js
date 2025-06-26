const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash('Pass@123', 12);
    
    // Update the existing admin user
    await prisma.user.update({
      where: {
        email: 'admin@example.com'
      },
      data: {
        email: 'pkminfotech637',
        password: hashedPassword
      }
    });

  } catch (error) {
    console.error('Error updating admin credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();