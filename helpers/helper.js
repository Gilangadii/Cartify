const easyinvoice = require('easyinvoice');

const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }

  async function generateInvoice(user, carts) {
    const productsList = carts.map(item => ({
      quantity: Number(item.quantity),
      description: item.Product.name,
      tax: 0,
      price: Number(item.Product.price)
    }));
    const shortId = String(Date.now()).slice(-6);
    const invoiceNumber = `INV-${shortId}`;
    const data = {
      sender: {
        company: "Cartify Official Store",
        address: "Jl. Jenderal Sudirman No. 1",
        zip: "10220",
        city: "Jakarta",
        country: "Indonesia"
      },
      client: {
        company: `${user.Profile.fullName} (${user.Profile.phoneNumber})`,
        address: user.Profile.address,
        zip: "10000",
        city: "Jakarta",
        country: user.email
      },
      information: {
        number: invoiceNumber,
        date: new Date().toLocaleDateString('id-ID'),
        "due-date": new Date().toLocaleDateString('id-ID')
      },
      products: productsList,
      "bottom-notice": "Terima kasih telah berbelanja di Cartify!",
      settings: {
        currency: "IDR"
      }
    };
  
    const result = await easyinvoice.createInvoice(data);
  
    if (result && result.pdfUrl) {
      const response = await fetch(result.pdfUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfBuffer = Buffer.from(arrayBuffer);
  
      return { pdfBuffer, invoiceNumber };
    } else if (result && result.pdf) {
      const pdfBuffer = Buffer.from(result.pdf, 'base64');
      return { pdfBuffer, invoiceNumber };
    }
  
    throw new Error("Gagal mendapatkan PDF dari easyinvoice.");
  }

module.exports = {rupiah, generateInvoice}