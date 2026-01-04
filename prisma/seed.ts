import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const { Pool } = pg;

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL_POSTGRESQL || process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Starting Proloans database seeding...");

	// Clear existing data (in correct order due to foreign keys)
	await prisma.transaction.deleteMany();
	await prisma.monthlySummary.deleteMany();
	await prisma.budget.deleteMany();
	await prisma.category.deleteMany();
	await prisma.collateral.deleteMany();
	await prisma.dependent.deleteMany();
	await prisma.document.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.loan.deleteMany();
	await prisma.user.deleteMany();
	await prisma.branch.deleteMany();
	await prisma.company.deleteMany();

	console.log("🧹 Cleared existing data");

	// Create Companies
	const companies = await Promise.all([
		prisma.company.create({
			data: {
				name: "Proloans Financial Services",
				code: "PLFS001",
				legalName: "Proloans Financial Services Inc.",
				taxId: "12-3456789",
				address: "123 Financial District",
				city: "New York",
				state: "NY",
				country: "USA",
				phone: "+1 (555) 123-4567",
				email: "contact@proloans.com",
				website: "https://proloans.com",
				isActive: true,
			},
		}),
		prisma.company.create({
			data: {
				name: "Acme Credit Union",
				code: "ACME001",
				legalName: "Acme Credit Union LLC",
				taxId: "98-7654321",
				address: "456 Business Avenue",
				city: "Los Angeles",
				state: "CA",
				country: "USA",
				phone: "+1 (555) 987-6543",
				email: "info@acmecredit.com",
				website: "https://acmecredit.com",
				isActive: true,
			},
		}),
		prisma.company.create({
			data: {
				name: "Global Lending Solutions",
				code: "GLS001",
				legalName: "Global Lending Solutions Corp.",
				taxId: "45-1234567",
				address: "789 Commerce Street",
				city: "Chicago",
				state: "IL",
				country: "USA",
				phone: "+1 (555) 456-7890",
				email: "support@globallending.com",
				website: "https://globallending.com",
				isActive: true,
			},
		}),
	]);

	console.log(`🏢 Created ${companies.length} companies`);

	// Create Branches for each company
	const branches = await Promise.all([
		// Branches for Proloans Financial Services
		prisma.branch.create({
			data: {
				code: "PLFS-NYC",
				name: "New York City Branch",
				companyId: companies[0].id,
				address: "123 Financial District",
				city: "New York",
				state: "NY",
				country: "USA",
				phone: "+1 (555) 123-4567",
				email: "nyc@proloans.com",
				isActive: true,
			},
		}),
		prisma.branch.create({
			data: {
				code: "PLFS-BOS",
				name: "Boston Branch",
				companyId: companies[0].id,
				address: "456 Beacon Street",
				city: "Boston",
				state: "MA",
				country: "USA",
				phone: "+1 (555) 123-4568",
				email: "boston@proloans.com",
				isActive: true,
			},
		}),
		// Branches for Acme Credit Union
		prisma.branch.create({
			data: {
				code: "ACME-LAX",
				name: "Los Angeles Branch",
				companyId: companies[1].id,
				address: "456 Business Avenue",
				city: "Los Angeles",
				state: "CA",
				country: "USA",
				phone: "+1 (555) 987-6543",
				email: "la@acmecredit.com",
				isActive: true,
			},
		}),
		prisma.branch.create({
			data: {
				code: "ACME-SF",
				name: "San Francisco Branch",
				companyId: companies[1].id,
				address: "789 Market Street",
				city: "San Francisco",
				state: "CA",
				country: "USA",
				phone: "+1 (555) 987-6544",
				email: "sf@acmecredit.com",
				isActive: true,
			},
		}),
		// Branch for Global Lending Solutions
		prisma.branch.create({
			data: {
				code: "GLS-CHI",
				name: "Chicago Branch",
				companyId: companies[2].id,
				address: "789 Commerce Street",
				city: "Chicago",
				state: "IL",
				country: "USA",
				phone: "+1 (555) 456-7890",
				email: "chicago@globallending.com",
				isActive: true,
			},
		}),
	]);

	console.log(`📍 Created ${branches.length} branches`);

	// Hash password for all users
	const defaultPassword = await bcrypt.hash("password123", 10);

	// Create sample users with Proloans-style data (associated with branches)
	const users = await Promise.all([
		prisma.user.create({
			data: {
				email: "admin@proloans.com",
				name: "Jeff D.",
				password: defaultPassword,
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
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "kiran.nair@example.com",
				name: "Kiran Nair",
				password: defaultPassword,
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
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "manager@proloans.com",
				name: "Sarah Manager",
				password: defaultPassword,
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
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "user1@example.com",
				name: "Mike Johnson",
				password: defaultPassword,
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
				branchId: branches[1].id, // Boston Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "user2@example.com",
				name: "Lisa Chen",
				password: defaultPassword,
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
				branchId: branches[2].id, // LAX Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "user3@example.com",
				name: "David Kim",
				password: defaultPassword,
				role: "USER",
				accountNumber: "7388333943",
				creditScore: 800,
				creditScoreLastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
				internalRiskScore: 17.0,
				maxRiskScore: 18.0,
				averageRate: 10.5,
				totalBorrowed: 750000.0,
				totalRepaid: 300000.0,
				memberType: "VIP",
				branchId: branches[3].id, // SF Branch
			},
		}),
		prisma.user.create({
			data: {
				email: "user4@example.com",
				name: "Maria Rodriguez",
				password: defaultPassword,
				role: "USER",
				accountNumber: "7388333944",
				creditScore: 680,
				creditScoreLastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				internalRiskScore: 12.5,
				maxRiskScore: 18.0,
				averageRate: 15.2,
				totalBorrowed: 120000.0,
				totalRepaid: 35000.0,
				memberType: "REGULAR",
				branchId: branches[4].id, // Chicago Branch
			},
		}),
	]);

	console.log(`👥 Created ${users.length} users`);

	// Create sample loans with Proloans-style data (associated with branches)
	const loans = await Promise.all([
		// Kiran Nair's loans (NYC Branch)
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
				branchId: branches[0].id, // NYC Branch
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
				branchId: branches[0].id, // NYC Branch
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
				branchId: branches[0].id, // NYC Branch
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
				branchId: branches[0].id, // NYC Branch
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
				branchId: branches[1].id, // Boston Branch
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
				branchId: branches[2].id, // LAX Branch
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "EDL9932828827",
				type: "EDUCATION_LOAN",
				amount: 80000.0,
				rate: 10.5,
				status: "ACTIVE",
				startDate: new Date("2023-08-15"),
				description: "Education loan for graduate studies",
				userId: users[5].id, // David Kim
				branchId: branches[3].id, // SF Branch
			},
		}),
		prisma.loan.create({
			data: {
				loanNumber: "PEL9932828828",
				type: "PERSONAL_LOAN",
				amount: 15000.0,
				rate: 16.8,
				status: "ACTIVE",
				startDate: new Date("2024-01-10"),
				description: "Personal loan for debt consolidation",
				userId: users[6].id, // Maria Rodriguez
				branchId: branches[4].id, // Chicago Branch
			},
		}),
	]);

	console.log(`💰 Created ${loans.length} loans`);

	// Create sample payments (associated with branches)
	const payments = await Promise.all([
		prisma.payment.create({
			data: {
				amount: 2500.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.payment.create({
			data: {
				amount: 1800.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.payment.create({
			data: {
				amount: 3200.0,
				date: new Date("2024-01-15"),
				type: "EMI",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.payment.create({
			data: {
				amount: 1500.0,
				date: new Date("2024-01-20"),
				type: "EMI",
				userId: users[3].id, // Mike Johnson
				branchId: branches[1].id, // Boston Branch
			},
		}),
		prisma.payment.create({
			data: {
				amount: 1200.0,
				date: new Date("2024-01-22"),
				type: "EMI",
				userId: users[4].id, // Lisa Chen
				branchId: branches[2].id, // LAX Branch
			},
		}),
		prisma.payment.create({
			data: {
				amount: 5000.0,
				date: new Date("2024-01-10"),
				type: "LUMP_SUM",
				userId: users[5].id, // David Kim
				branchId: branches[3].id, // SF Branch
			},
		}),
	]);

	console.log(`💳 Created ${payments.length} payments`);

	// Create sample documents (associated with branches)
	const documents = await Promise.all([
		prisma.document.create({
			data: {
				name: "Aadhar Card",
				type: "ID_PROOF",
				url: "/documents/aadhar.pdf",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.document.create({
			data: {
				name: "PAN Card",
				type: "ID_PROOF",
				url: "/documents/pan.pdf",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.document.create({
			data: {
				name: "Salary Slip",
				type: "INCOME_PROOF",
				url: "/documents/salary.pdf",
				userId: users[1].id, // Kiran Nair
				branchId: branches[0].id, // NYC Branch
			},
		}),
		prisma.document.create({
			data: {
				name: "Driver's License",
				type: "ID_PROOF",
				url: "/documents/license.pdf",
				userId: users[3].id, // Mike Johnson
				branchId: branches[1].id, // Boston Branch
			},
		}),
		prisma.document.create({
			data: {
				name: "Bank Statement",
				type: "BANK_STATEMENT",
				url: "/documents/bank_statement.pdf",
				userId: users[5].id, // David Kim
				branchId: branches[3].id, // SF Branch
			},
		}),
	]);

	console.log(`📄 Created ${documents.length} documents`);

	// Create default categories
	const categories = await Promise.all([
		prisma.category.create({
			data: {
				name: "Food & Dining",
				icon: "🍔",
				color: "#FF6B6B",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Shopping",
				icon: "🛍️",
				color: "#4ECDC4",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Transportation",
				icon: "🚗",
				color: "#45B7D1",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Bills & Utilities",
				icon: "💡",
				color: "#FFA07A",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Entertainment",
				icon: "🎬",
				color: "#9B59B6",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Healthcare",
				icon: "🏥",
				color: "#E74C3C",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Education",
				icon: "📚",
				color: "#3498DB",
				isDefault: true,
			},
		}),
		prisma.category.create({
			data: {
				name: "Travel",
				icon: "✈️",
				color: "#1ABC9C",
				isDefault: true,
			},
		}),
	]);

	console.log(`📂 Created ${categories.length} categories`);

	// Create sample transactions
	const transactions = await Promise.all([
		prisma.transaction.create({
			data: {
				userId: users[1].id, // Kiran Nair
				amount: 45.50,
				categoryId: categories[0].id, // Food & Dining
				date: new Date("2024-01-15"),
				note: "Lunch at restaurant",
				paymentMethod: "Credit Card",
				location: "New York, NY",
			},
		}),
		prisma.transaction.create({
			data: {
				userId: users[1].id,
				amount: 120.00,
				categoryId: categories[1].id, // Shopping
				date: new Date("2024-01-16"),
				note: "Grocery shopping",
				paymentMethod: "Debit Card",
				location: "New York, NY",
			},
		}),
		prisma.transaction.create({
			data: {
				userId: users[1].id,
				amount: 35.00,
				categoryId: categories[2].id, // Transportation
				date: new Date("2024-01-17"),
				note: "Uber ride",
				paymentMethod: "Credit Card",
				location: "New York, NY",
			},
		}),
		prisma.transaction.create({
			data: {
				userId: users[3].id, // Mike Johnson
				amount: 150.00,
				categoryId: categories[3].id, // Bills & Utilities
				date: new Date("2024-01-18"),
				note: "Electric bill",
				paymentMethod: "Bank Transfer",
				location: "Boston, MA",
			},
		}),
		prisma.transaction.create({
			data: {
				userId: users[4].id, // Lisa Chen
				amount: 80.00,
				categoryId: categories[4].id, // Entertainment
				date: new Date("2024-01-19"),
				note: "Movie tickets",
				paymentMethod: "Credit Card",
				location: "Los Angeles, CA",
			},
		}),
		prisma.transaction.create({
			data: {
				userId: users[5].id, // David Kim
				amount: 200.00,
				categoryId: categories[5].id, // Healthcare
				date: new Date("2024-01-20"),
				note: "Doctor visit",
				paymentMethod: "Insurance",
				location: "San Francisco, CA",
			},
		}),
	]);

	console.log(`💸 Created ${transactions.length} transactions`);

	// Create sample budgets
	const budgets = await Promise.all([
		prisma.budget.create({
			data: {
				userId: users[1].id, // Kiran Nair
				categoryId: categories[0].id, // Food & Dining
				amount: 500.00,
				period: "MONTHLY",
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-01-31"),
			},
		}),
		prisma.budget.create({
			data: {
				userId: users[1].id,
				categoryId: categories[1].id, // Shopping
				amount: 300.00,
				period: "MONTHLY",
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-01-31"),
			},
		}),
		prisma.budget.create({
			data: {
				userId: users[3].id, // Mike Johnson
				amount: 2000.00,
				period: "MONTHLY",
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-01-31"),
			},
		}),
		prisma.budget.create({
			data: {
				userId: users[4].id, // Lisa Chen
				categoryId: categories[4].id, // Entertainment
				amount: 150.00,
				period: "MONTHLY",
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-01-31"),
			},
		}),
	]);

	console.log(`💰 Created ${budgets.length} budgets`);

	// Create monthly summaries
	const monthlySummaries = await Promise.all([
		prisma.monthlySummary.create({
			data: {
				userId: users[1].id, // Kiran Nair
				year: 2024,
				month: 0, // January (0-indexed)
				totalSpent: 200.50,
				categoryBreakdown: [
					{ categoryId: categories[0].id, amount: 45.50 },
					{ categoryId: categories[1].id, amount: 120.00 },
					{ categoryId: categories[2].id, amount: 35.00 },
				],
			},
		}),
		prisma.monthlySummary.create({
			data: {
				userId: users[3].id, // Mike Johnson
				year: 2024,
				month: 0,
				totalSpent: 150.00,
				categoryBreakdown: [
					{ categoryId: categories[3].id, amount: 150.00 },
				],
			},
		}),
	]);

	console.log(`📊 Created ${monthlySummaries.length} monthly summaries`);

	console.log("\n🎉 Proloans database seeding completed successfully!");
	console.log("\n📊 Sample Data Summary:");
	console.log(`   Companies: ${companies.length}`);
	console.log(`   Branches: ${branches.length}`);
	console.log(`   Users: ${users.length}`);
	console.log(`   Loans: ${loans.length}`);
	console.log(`   Payments: ${payments.length}`);
	console.log(`   Documents: ${documents.length}`);
	console.log(`   Categories: ${categories.length}`);
	console.log(`   Transactions: ${transactions.length}`);
	console.log(`   Budgets: ${budgets.length}`);
	console.log(`   Monthly Summaries: ${monthlySummaries.length}`);

	console.log("\n🏢 Companies:");
	companies.forEach((company) => {
		console.log(`   - ${company.name} (${company.code})`);
	});

	console.log("\n📍 Branches by Company:");
	for (const company of companies) {
		const companyBranches = branches.filter((b) => b.companyId === company.id);
		console.log(`   ${company.name}:`);
		companyBranches.forEach((branch) => {
			console.log(`     - ${branch.name} (${branch.code})`);
		});
	}

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
			const branch = branches.find((b) => b.id === user.branchId);
			console.log(`   - ${user.name} (${branch?.name || 'No Branch'}): ${userLoans.length} loans`);
		}
	}

	console.log("\n📈 Users by Branch:");
	for (const branch of branches) {
		const branchUsers = users.filter((u) => u.branchId === branch.id);
		if (branchUsers.length > 0) {
			console.log(`   ${branch.name}: ${branchUsers.length} users`);
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
