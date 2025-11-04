import axios from "axios";
import { momoConfig, getMomoToken } from "../config/momo.js";
import { v4 as uuidv4 } from "uuid";

export const requestToPay = async (amount, phoneNumber, userId, description) => {
  const token = await getMomoToken();
  const referenceId = uuidv4();

  try {
    await axios.post(
      `${momoConfig.baseUrl}${momoConfig.collectionUrl}`,
      {
        amount,
        currency: "RWF",
        externalId: userId,
        payer: {
          partyIdType: "MSISDN",
          partyId: phoneNumber,
        },
        payerMessage: description,
        payeeNote: "Film Nyarwanda Payment",
      },
      {
        headers: {
          "X-Reference-Id": referenceId,
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, referenceId };
  } catch (error) {
    console.error("❌ MoMo Request Error:", error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  }
};

// 🔍 Check payment status
export const checkPaymentStatus = async (referenceId) => {
  const token = await getMomoToken();

  try {
    const response = await axios.get(
      `${momoConfig.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // { status: 'SUCCESSFUL' | 'FAILED' | 'PENDING' }
  } catch (error) {
    console.error("❌ Status Check Error:", error.response?.data || error);
    return { status: "FAILED", error: error.response?.data || error };
  }
};
