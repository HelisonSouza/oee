const PdfPrinter = require('pdfmake')
const path = require('path')
const fs = require('fs')
const fonts = {
  Roboto: {
    normal: path.resolve('public/fonts/Roboto-Regular.ttf'),
    bold: path.resolve('public/fonts/Roboto-Bold.ttf'),
    italics: path.resolve('public/fonts/Roboto-Italic.ttf'),
    bolditalics: path.resolve('public/font/Roboto-BoldItalic.ttf')
  }
}


module.exports = {

  genPdf() {
    //gerando linhas dinâmicas na tabela
    const rows = []
    const cows = ['Nome', 'E-mail', 'Situação']
    const title = {
      text: "Relatório de Produções teste ",
      style: {
        fontSize: 14,
        bold: true
      }
    }
    rows.push(cows)
    for (let i = 0; i < 300; i++) {
      rows.push(['Hélison', 'helison@mail.com', 'ativo'])
    }

    const printer = new PdfPrinter(fonts)

    const docDefiniton = {
      content: [
        {
          image: path.resolve('public/img/logo.png'),
          fit: [100, 100],
        },
        { text: title },
        {
          table: {
            widths: ['*', '*', 100],
            body: rows
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true
        }
      },
      footer: (page, pages) => {
        return {
          columns: [
            'Relatório com dados do sistema Radar 4.0',
            {
              alignment: 'right',
              text: [
                { text: page.toString(), italics: true },
                ' de ',
                { text: pages.toString(), italics: true },
              ]
            }
          ],
          margin: [40, 0]
        }
      }
    }

    const pdf = printer.createPdfKitDocument(docDefiniton)
    pdf.pipe(fs.createWriteStream('doc.pdf'))
    pdf.end()
  }

}


