import SibApiV3Sdk from 'sib-api-v3-sdk';

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.REGISTERED_API_KEY;

const sendOrderConfirmationEmail = async (to, orderDetails) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: 'faizanlahori2003@gmail.com', name: 'Witty Wardrobe' };
    sendSmtpEmail.subject = 'Order Confirmation';

    const { orderId, orderDate, items, totalAmount } = orderDetails;

    const textContent = `Dear Customer,
    
Your order (ID: ${orderId}) has been confirmed on ${orderDate}.
Total Amount: Rs ${totalAmount}

Items:
${items.map(item => `- ${item.name}: ${item.quantity} x ${item.price}`).join('\n')}

Thank you for your purchase!

Best regards,
Witty Wardrobe`;

    const htmlContent = `<p>Dear Customer,</p>
<p>Your order (ID: <strong>${orderId}</strong>) has been confirmed on <strong>${orderDate}</strong>.</p>
<p>Total Amount: Rs <strong>${totalAmount}</strong></p>
<p><strong>Items:</strong></p>
<ul>
  ${items.map(item => `<li>${item.name}: ${item.quantity} x ${item.price}</li>`).join('')}
</ul>
<p>Thank you for your purchase!</p>
<p>Best regards,<br>Witty Wardrobe</p>`;

    sendSmtpEmail.textContent = textContent;
    sendSmtpEmail.htmlContent = htmlContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendOrderConfirmationEmail;
