import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting Proloans database seeding...");

	// Clear existing data
	await prisma.collateral.deleteMany();
	await prisma.dependent.deleteMany();
	await prisma.document.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.loan.deleteMany();
	await prisma.user.deleteMany();

	console.log("🧹 Cleared existing data");

	// Create sample users with Proloans-style data
	const users = await Promise.all([
		prisma.user.create({
			data: {
				email: "admin@proloans.com",
				name: "Jeff D.",
				role: "ADMIN",
				accountNumber: "7388333939",
				creditScore: 820,
				creditScoreLastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
				internalRiskScore: 16.66,
				maxRiskScore: 18.0,
				averageRate: 12.21,
				totalBorrowed: 901122.11,
				totalRepaid: 213428.71,
				memberType: "ELITE",
			},
		}),
		prisma.user.create({
			data: {
				email: "kiran.nair@example.com",
				name: "Kiran Nair",
				role: "USER",
				accountNumber: "7388399092222112",
				creditScore: 780,
				creditScoreLastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
				internalRiskScore: 16.66,
				maxRiskScore: 18.0,
				averageRate: 12.21,
				totalBorrowed: 901122.11,
				totalRepaid: 213428.71,
				memberType: "ELITE",
			},
		}),
		prisma.user.create({
			data: {
				email: "manager@proloans.com",
				name: "Sarah Manager",
				role: "MANAGER",
				accountNumber: "7388333940",
				creditScore: 795,
				creditScoreLastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
				internalRiskScore: 15.2,
				maxRiskScore: 18.0,
				averageRate: 11.85,
				totalBorrowed: 650000.0,
				totalRepaid: 180000.0,
				memberType: "PREMIUM",
			},
		}),
		prisma.user.create({
			data: {
				email: "user1@example.com",
				name: "Mike Johnson",
				role: "USER",
				accountNumber: "7388333941",
				creditScore: 720,
				creditScoreLastChecked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
				internalRiskScore: 14.5,
				maxRiskScore: 18.0,
				averageRate: 13.5,
				totalBorrowed: 250000.0,
				totalRepaid: 75000.0,
				memberType: "REGULAR",
			},
		}),
		prisma.user.create({
			data: {
				email: "user2@example.com",
				name: "Lisa Chen",
				role: "USER",
				accountNumber: "7388333942",
				creditScore: 750,
				creditScoreLastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
				internalRiskScore: 13.8,
				maxRiskScore: 18.0,
				averageRate: 12.8,
				totalBorrowed: 180000.0,
				totalRepaid: 45000.0,
				memberType: "REGULAR",
			},
		}),
	]);

	console.log(`👥 Created ${users.length} users`);

	// Create sample loans with Proloans-style data
	const loans = await Promise.all([
		// Kiran Nair's loans (from the UI image)
		prisma.loan.create({
			data: {
				loanNumber: "HML9932828823",
				type: "HOME_LOAN",
				amount: 500000.0,
				rate: 9.12,
				status: "ACTIVE",
				startDate: new Date("2020-12-21"),
				description: "Home loan for primary residence",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "CRL9932828823",
				type: "CAR_LOAN",
				amount: 45000.0,
				rate: 12.22,
				status: "ACTIVE",
				startDate: new Date("2020-12-21"),
				description: "Car loan for new vehicle",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "BZL9932828823",
				type: "BUSINESS_LOAN",
				amount: 200000.0,
				rate: 11.12,
				status: "ACTIVE",
				startDate: new Date("2020-12-21"),
				description: "Business expansion loan",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "PEL9932828824",
				type: "PERSONAL_LOAN",
				amount: 25000.0,
				rate: 15.5,
				status: "ACTIVE",
				startDate: new Date("2021-03-15"),
				description: "Personal loan for home renovation",
				userId: users[1].id, // Kiran Nair
			},
		}),
		// Other users' loans
		prisma.loan.create({
			data: {
				loanNumber: "HML9932828825",
				type: "HOME_LOAN",
				amount: 300000.0,
				rate: 8.95,
				status: "ACTIVE",
				startDate: new Date("2021-06-10"),
				description: "Home loan for investment property",
				userId: users[3].id, // Mike Johnson
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "CRL9932828826",
				type: "CAR_LOAN",
				amount: 35000.0,
				rate: 13.2,
				status: "ACTIVE",
				startDate: new Date("2022-01-20"),
				description: "Car loan for used vehicle",
				userId: users[4].id, // Lisa Chen
			},
		}),
	]);

	console.log(`💰 Created ${loans.length} loans`);

	// Create sample payments
	const payments = await Promise.all([
		prisma.payment.create({
			data: {
				amount: 2500.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.payment.create({
			data: {
				amount: 1800.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.payment.create({
			data: {
				amount: 3200.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
			},
		}),
	]);

	console.log(`💳 Created ${payments.length} payments`);

	// Create sample documents
	const documents = await Promise.all([
		prisma.document.create({
			data: {
				name: "Aadhar Card",
				type: "ID_PROOF",
				url: "/documents/aadhar.pdf",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.document.create({
			data: {
				name: "PAN Card",
				type: "ID_PROOF",
				url: "/documents/pan.pdf",
				userId: users[1].id, // Kiran Nair
			},
		}),
		prisma.document.create({
			data: {
				name: "Salary Slip",
				type: "INCOME_PROOF",
				url: "/documents/salary.pdf",
				userId: users[1].id, // Kiran Nair
			},
		}),
	]);

	console.log(`📄 Created ${documents.length} documents`);

	console.log("\n🎉 Proloans database seeding completed successfully!");
	console.log("\n📊 Sample Data Summary:");
	console.log(`   Users: ${users.length}`);
	console.log(`   Loans: ${loans.length}`);
	console.log(`   Payments: ${payments.length}`);
	console.log(`   Documents: ${documents.length}`);

	console.log("\n👤 Elite Members:");
	users
		.filter((u) => u.memberType === "ELITE")
		.forEach((user) => {
			console.log(`   - ${user.name} (${user.email}) - Credit Score: ${user.creditScore}`);
		});

	console.log("\n💳 Active Loans by User:");
	for (const user of users) {
		const userLoans = loans.filter((l) => l.userId === user.id);
		if (userLoans.length > 0) {
			console.log(`   - ${user.name}: ${userLoans.length} loans`);
		}
	}
}

main()
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
