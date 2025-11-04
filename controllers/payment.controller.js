import { requestToPay, checkPaymentStatus } from "../utils/momoHelper.js";
import Payment from "../models/payment.model.js";
import User from "../models/User.js";

export const payWithMoMo = async (req, res) => {
  const { amount, phoneNumber, userId, description } = req.body;

  try {
    const paymentInit = await requestToPay(amount, phoneNumber, userId, description);

    if (!paymentInit.success) {
      return res.status(400).json({
        message: "MoMo payment initiation failed",
        error: paymentInit.error,
      });
    }

    const { referenceId } = paymentInit;

    // 💾 Save initial payment record
    const payment = new Payment({
      amount,
      currency: "RWF",
      paymentMethod: "MoMo",
      paymentStatus: "pending",
      paymentDate: new Date(),
      userId,
      movieId: req.params.id,
      momoReferenceId: referenceId,
    });
    await payment.save();

    // 🕐 Wait a few seconds before checking status
    setTimeout(async () => {
      const statusData = await checkPaymentStatus(referenceId);

      if (statusData.status === "SUCCESSFUL") {
        payment.paymentStatus = "success";
        await payment.save();

        // ✅ Update user's plan
        await User.findByIdAndUpdate(userId, { plan: "paid" });

        console.log(`✅ User ${userId} payment successful`);
      } else if (statusData.status === "FAILED") {
        payment.paymentStatus = "failed";
        await payment.save();
      }
    }, 8000); // check after 8 seconds (can adjust)

    res.status(200).json({
      message: "MoMo payment initiated",
      referenceId,
      payment,
    });
  } catch (error) {
    console.error("❌ MoMo Payment Error:", error);
    res.status(500).json({ message: "Payment Error", error: error.message });
  }
};
