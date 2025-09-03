import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create devices
  const desktopWindows = await prisma.device.create({
    data: {
      name: 'Desktop Windows 11',
      type: 'DESKTOP',
      manufacturer: 'Generic',
      model: 'Desktop PC',
      os: 'Windows',
      osVersion: '11',
      resolution: '1920x1080',
      isMobile: false
    }
  })

  const desktopMac = await prisma.device.create({
    data: {
      name: 'Desktop macOS',
      type: 'DESKTOP',
      manufacturer: 'Apple',
      model: 'MacBook Pro',
      os: 'macOS',
      osVersion: 'Sonoma',
      resolution: '2560x1440',
      isMobile: false
    }
  })

  const iphone = await prisma.device.create({
    data: {
      name: 'iPhone 15 Pro',
      type: 'MOBILE',
      manufacturer: 'Apple',
      model: 'iPhone 15 Pro',
      os: 'iOS',
      osVersion: '17',
      resolution: '1179x2556',
      isMobile: true
    }
  })

  const samsung = await prisma.device.create({
    data: {
      name: 'Samsung Galaxy S24',
      type: 'MOBILE',
      manufacturer: 'Samsung',
      model: 'Galaxy S24',
      os: 'Android',
      osVersion: '14',
      resolution: '1080x2340',
      isMobile: true
    }
  })

  const ipad = await prisma.device.create({
    data: {
      name: 'iPad Pro',
      type: 'TABLET',
      manufacturer: 'Apple',
      model: 'iPad Pro',
      os: 'iPadOS',
      osVersion: '17',
      resolution: '2048x2732',
      isMobile: true
    }
  })

  // Create browsers
  const chrome = await prisma.browser.create({
    data: {
      name: 'Chrome',
      version: '120',
      engine: 'Blink',
      isMobile: false
    }
  })

  const firefox = await prisma.browser.create({
    data: {
      name: 'Firefox',
      version: '121',
      engine: 'Gecko',
      isMobile: false
    }
  })

  const safari = await prisma.browser.create({
    data: {
      name: 'Safari',
      version: '17',
      engine: 'WebKit',
      isMobile: false
    }
  })

  const mobileSafari = await prisma.browser.create({
    data: {
      name: 'Mobile Safari',
      version: '17',
      engine: 'WebKit',
      isMobile: true
    }
  })

  // Create browser-device combinations
  await prisma.browserDevice.createMany({
    data: [
      { deviceId: desktopWindows.id, browserId: chrome.id },
      { deviceId: desktopWindows.id, browserId: firefox.id },
      { deviceId: desktopMac.id, browserId: chrome.id },
      { deviceId: desktopMac.id, browserId: safari.id },
      { deviceId: desktopMac.id, browserId: firefox.id },
      { deviceId: iphone.id, browserId: mobileSafari.id },
      { deviceId: iphone.id, browserId: chrome.id },
      { deviceId: samsung.id, browserId: chrome.id },
      { deviceId: ipad.id, browserId: safari.id },
      { deviceId: ipad.id, browserId: chrome.id },
    ]
  })

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User'
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })