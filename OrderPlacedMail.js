import SibApiV3Sdk from 'sib-api-v3-sdk';

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.REGISTERED_API_KEY;

const sendPlacedOrderEmail = async (to, orderDetails) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: 'faizanlahori2003@gmail.com', name: 'Witty Wardrobe' };
    sendSmtpEmail.subject = 'Out for Delivery';

    const { orderDate, items, totalAmount } = orderDetails;

    const textContent = `Dear Customer,
    
Your order has been out for delivery ${orderDate}.
Total Amount: ${totalAmount}

Items:
${items.map(item => `- ${item.name}: ${item.quantity} x ${item.price}`).join('\n')}

Thank you for your purchase!

Best regards,
Witty Wardrobe`;

    const htmlContent = `<p>Dear Customer,</p>
<p>Your order has been out for delivery at <strong>${orderDate}</strong>.</p>
<p>Total Amount: <strong>${totalAmount}</strong></p>
<p><strong>Items:</strong></p>
<ul>
  ${items.map(item => `<li>${item.name}: ${item.quantity} x ${item.price}</li>`).join('')}
</ul>
<p>Thank you for your purchase!</p>
<p>Best regards,<br>Witty Wardrobe</p>`;

    sendSmtpEmail.textContent = textContent;
    sendSmtpEmail.htmlContent = htmlContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendPlacedOrderEmail;
