const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'pkminfotech048@gmail.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists!')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Pass@123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'pkminfotech048@gmail.com',
        name: 'Pkminfotech Admin',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('Admin user created successfully!')
    console.log('Email: pkminfotech048@gmail.com')
    console.log('Password: Pass@123')
    console.log('Please change the password after first login.')

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser() 