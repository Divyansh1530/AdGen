import { prisma } from "../../shared/lib/prisma.js";

export const checkCredits = async (
  userId: string,
  requiredCredits: number
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.credits >= requiredCredits;
};

export const deductCredits = async (
  userId: string,
  amount: number,
  type: "IMAGE_GENERATION" | "VIDEO_GENERATION",
  description?: string
): Promise<void> => {
  if (amount <= 0) {
    throw new Error("Credit amount must be greater than zero");
  }

  await prisma.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      where: {
        id: userId,
        credits: {
          gte: amount,
        },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });

    if (result.count === 0) {
      throw new Error("Insufficient credits");
    }

    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type,
        balanceAfter: user.credits,
        description: description ?? null,
      },
    });
  });
};

export const refundCredits = async (
  userId: string,
  amount: number,
  description?: string
): Promise<void> => {
  if (amount <= 0) {
    throw new Error("Credit amount must be greater than zero");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Add credits back to the user's balance
    const user = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: {
        credits: true,
      },
    });

    // 2. Record the refund transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: "REFUND",
        balanceAfter: user.credits,
        description: description ?? null,
      },
    });
  });
};

export const getCredits = async (userId: string): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.credits;
};
