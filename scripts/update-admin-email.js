const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Pass@123', 12);
    
    // Update the existing admin user with proper email format
    await prisma.user.update({
      where: {
        email: 'pkminfotech637'
      },
      data: {
        email: 'pkminfotech637@gmail.com',
        password: hashedPassword
      }
    });

  } catch (error) {
    // Removed console.error for production cleanliness
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();