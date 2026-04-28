import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  const hashedUserPassword = await bcrypt.hash('password123', 10)

  const godTenant = await prisma.tenant.upsert({
    where: { slug: 'armstrong-corporate' },
    update: {},
    create: {
      name: 'Armstrong Corporate',
      slug: 'armstrong-corporate',
      domain: 'armstrong.com',
      active: true,
    },
  })

  console.log('✅ Created God Mode Tenant')

  const godUser = await prisma.user.upsert({
    where: { email: 'admin@armstrong.com' },
    update: {},
    create: {
      email: 'admin@armstrong.com',
      name: 'Super Admin',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      tenantId: godTenant.id,
      active: true,
    },
  })

  console.log('✅ Created God Mode User (admin@armstrong.com / admin123)')

  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'armstrong-atlanta' },
    update: {},
    create: {
      name: 'Armstrong Atlanta',
      slug: 'armstrong-atlanta',
      active: true,
    },
  })

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'armstrong-dallas' },
    update: {},
    create: {
      name: 'Armstrong Dallas',
      slug: 'armstrong-dallas',
      active: true,
    },
  })

  console.log('✅ Created Partner Tenants (Atlanta, Dallas)')

  const location1 = await prisma.location.upsert({
    where: { id: 'atlanta-main' },
    update: {},
    create: {
      id: 'atlanta-main',
      tenantId: tenant1.id,
      name: 'Atlanta Main Warehouse',
      address: '123 Peachtree St',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303',
      active: true,
    },
  })

  const location2 = await prisma.location.upsert({
    where: { id: 'dallas-main' },
    update: {},
    create: {
      id: 'dallas-main',
      tenantId: tenant2.id,
      name: 'Dallas Distribution Center',
      address: '456 Commerce St',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      active: true,
    },
  })

  console.log('✅ Created Locations')

  const adminUser = await prisma.user.upsert({
    where: { email: 'manager@location1.com' },
    update: {},
    create: {
      email: 'manager@location1.com',
      name: 'Location Manager',
      passwordHash: hashedUserPassword,
      role: 'ADMIN',
      tenantId: tenant1.id,
      active: true,
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@location1.com' },
    update: {},
    create: {
      email: 'user@location1.com',
      name: 'Regular User',
      passwordHash: hashedUserPassword,
      role: 'USER',
      tenantId: tenant1.id,
      active: true,
    },
  })

  console.log('✅ Created Users')

  const laborTemplates = [
    { name: 'Driver - Loaded Rate', baseValue: 23.76, unit: 'per hour' },
    { name: 'Warehouse Worker - Loaded Rate', baseValue: 21.50, unit: 'per hour' },
    { name: 'Installation Specialist - Loaded Rate', baseValue: 28.00, unit: 'per hour' },
    { name: 'Supervisor - Loaded Rate', baseValue: 32.50, unit: 'per hour' },
  ]

  for (const labor of laborTemplates) {
    await prisma.costTemplate.upsert({
      where: { id: `labor-${labor.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `labor-${labor.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'LABOR',
        name: labor.name,
        baseValue: labor.baseValue,
        unit: labor.unit,
        active: true,
      },
    })
  }

  console.log('✅ Created Labor Cost Templates')

  const equipmentTemplates = [
    { name: 'Fuel Cost per Mile', baseValue: 0.68, unit: 'per mile' },
    { name: 'Truck - Depreciation + Maintenance', baseValue: 0.45, unit: 'per mile' },
    { name: 'Forklift - Hourly Rate', baseValue: 12.00, unit: 'per hour' },
    { name: 'Pallet Jack - Daily Rate', baseValue: 8.00, unit: 'per day' },
  ]

  for (const equip of equipmentTemplates) {
    await prisma.costTemplate.upsert({
      where: { id: `equipment-${equip.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `equipment-${equip.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'EQUIPMENT',
        name: equip.name,
        baseValue: equip.baseValue,
        unit: equip.unit,
        active: true,
      },
    })
  }

  console.log('✅ Created Equipment Cost Templates')

  const overheadTemplates = [
    { name: 'Final Mile - Per Route', baseValue: 65.00, unit: 'per route' },
    { name: 'Installation - Per Unit', baseValue: 8.50, unit: 'per unit' },
    { name: 'Warehouse - Daily Allocation', baseValue: 125.00, unit: 'per day' },
  ]

  for (const overhead of overheadTemplates) {
    await prisma.costTemplate.upsert({
      where: { id: `overhead-${overhead.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `overhead-${overhead.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'OVERHEAD',
        name: overhead.name,
        baseValue: overhead.baseValue,
        unit: overhead.unit,
        active: true,
      },
    })
  }

  console.log('✅ Created Overhead Cost Templates')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('   🔑 God Mode: admin@armstrong.com / admin123')
  console.log('   👤 Admin: manager@location1.com / password123')
  console.log('   👤 User: user@location1.com / password123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
