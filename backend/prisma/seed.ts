import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tif.com' },
    update: {},
    create: {
      email: 'admin@tif.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@tif.com' },
    update: {},
    create: {
      email: 'user@tif.com',
      name: 'Usuario Demo',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { name: 'Electrónica' },
    update: {},
    create: { name: 'Electrónica', description: 'Dispositivos electrónicos y gadgets' },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Ropa' },
    update: {},
    create: { name: 'Ropa', description: 'Indumentaria y accesorios' },
  });

  const food = await prisma.category.upsert({
    where: { name: 'Alimentos' },
    update: {},
    create: { name: 'Alimentos', description: 'Productos alimenticios' },
  });

  // Create products
  const products = [
    { name: 'Laptop Pro 15"', description: 'Laptop de alta gama para profesionales', price: 1299.99, stock: 15, categoryId: electronics.id },
    { name: 'Auriculares BT', description: 'Auriculares inalámbricos con cancelación de ruido', price: 199.99, stock: 42, categoryId: electronics.id },
    { name: 'Smartphone X12', description: 'El último modelo con cámara de 108MP', price: 899.99, stock: 8, categoryId: electronics.id },
    { name: 'Remera Básica', description: 'Remera de algodón 100% premium', price: 29.99, stock: 120, categoryId: clothing.id },
    { name: 'Jeans Slim', description: 'Jeans ajustados de alta calidad', price: 79.99, stock: 55, categoryId: clothing.id },
    { name: 'Zapatillas Runner', description: 'Calzado deportivo para correr', price: 149.99, stock: 30, categoryId: clothing.id },
    { name: 'Café Premium', description: 'Café de origen único, tostado artesanal', price: 24.99, stock: 200, categoryId: food.id },
    { name: 'Aceite de Oliva', description: 'Aceite de oliva extra virgen 500ml', price: 18.99, stock: 80, categoryId: food.id },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create a sample order
  const p = await prisma.product.findFirst();
  if (p) {
    await prisma.order.create({
      data: {
        userId: user.id,
        total: p.price * 2,
        status: 'COMPLETED',
        items: {
          create: [{ productId: p.id, quantity: 2, price: p.price }],
        },
      },
    });
  }

  console.log('✅ Seed completado!');
  console.log('👤 Admin: admin@tif.com / admin123');
  console.log('👤 User:  user@tif.com  / user123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
