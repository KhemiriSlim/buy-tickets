# 🎟️ buy-tickets

A full-stack event ticketing platform where organizers publish events and
users buy tickets that are minted on-chain as ERC-1155 tokens (Sepolia testnet).

## Features
- Organizers create and manage events and ticket types
- User registration and login with JWT authentication and role-based access (user / organizer)
- Browse events and purchase tickets through MetaMask
- Tickets minted via an ERC-1155 smart contract, with the transaction hash stored in the database
- User dashboard showing owned tickets
- Ticket verification for organizers at the event
- Safe purchases using Serializable database transactions to prevent overselling

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL 16, Prisma
- **Blockchain:** Solidity (ERC-1155), ethers.js, Sepolia
- **DevOps:** Docker / Docker Compose, Swagger (API docs)
## Author
Khemiri Slim — Computer Science student, ISSAT Mateur
