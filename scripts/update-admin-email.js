const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Pass@123', 12);
    
    // Update the existing admin user with proper email format
    const updatedUser = await prisma.user.update({
      where: {
        email: 'pkminfotech637'
      },
      data: {
        email: 'pkminfotech637@gmail.com',
        password: hashedPassword
      }
    });

    console.log('Admin credentials updated successfully!');
    console.log('New Email:', updatedUser.email);
    console.log('New Password: Pass@123');
    console.log('Please use these credentials to login.');

  } catch (error) {
    console.error('Error updating admin credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail(); 