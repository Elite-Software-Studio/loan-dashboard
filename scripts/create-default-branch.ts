import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDefaultBranch() {
	console.log("🌳 Creating default branch...");

	try {
		// Check if default branch already exists
		const existingBranch = await prisma.branch.findUnique({
			where: { code: "DEFAULT" },
		});

		if (existingBranch) {
			console.log("✅ Default branch already exists:", existingBranch.id);
			return existingBranch;
		}

		// Create default branch
		const branch = await prisma.branch.create({
			data: {
				code: "DEFAULT",
				name: "Default Branch",
				city: "Main Office",
				country: "USA",
				isActive: true,
			},
		});

		console.log("✅ Default branch created:", branch.id);
		console.log("   Code:", branch.code);
		console.log("   Name:", branch.name);

		return branch;
	} catch (error) {
		console.error("❌ Error creating default branch:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

createDefaultBranch()
	.then(() => {
		console.log("🎉 Done!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("💥 Failed:", error);
		process.exit(1);
	});
