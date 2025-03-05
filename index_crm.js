import {Builder, Browser, By, until, Key} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import FileHandler from './src/Arquivos.js'
import path from 'path'

async function WebScraping (){
    let dirorigem = 'Y:\\Downloads'
    let dirdestino = 'Y:\\REDECASTELO'
    let filehandler = new FileHandler()
    let opts = new chrome.Options()
    let prefs = {"download.default_directory": "Y:\\Downloads"}
    opts.setUserPreferences(prefs)
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(opts).build()
    try{
        await driver.manage().setTimeouts({implicit: 30000})
        await driver.get('https://crm.atonsystems.com.br/')
        await driver.wait(until.titleIs('AtonSystems Soluções em TI'), 30000)
        let usuario = await driver.findElement(By.xpath('//*[@id="txtLoginEmail"]'))
        let senha = await driver.findElement(By.xpath('//*[@id="txtLoginPassword"]'))
        let btnlogin = await driver.findElement(By.xpath('//*[@id="btnLogin"]'))
        await usuario.sendKeys('campinas@nslogtransportes.com.br')
        await senha.sendKeys('!Oku1JRb')
        await btnlogin.click()
        await driver.sleep(5000)

        await driver.navigate().to('https://crm.atonsystems.com.br/controlefrota/fatura')
        await driver.wait(until.elementLocated(By.xpath('//*[@id="divRequisicao"]/table')),30000)
        let faturas = await driver.findElements(By.tagName('tr'))
        let dia = new Date().toLocaleDateString()
        for(let i=0; i< faturas.length - 1; i++){
            let xpNumFat = `//*[@id="results"]/tr[${i+1}]/td[1]`
            let xpEmissao = `//*[@id="results"]/tr[${i+1}]/td[3]`
            let numfat = await faturas[i].findElement(By.xpath(xpNumFat)).getText()
            let dtaemissao = await faturas[i].findElement(By.xpath(xpEmissao)).getText()
            console.log(dia)
            console.log(dtaemissao)
            if(dia == dtaemissao){
                console.log('Entrou!!!!')
                let xpBtnFatura = `//*[@id="results"]/tr[${i+1}]/td[8]/a[5]/i`
                let btnFatura = await faturas[i].findElement(By.xpath(xpBtnFatura))
                await btnFatura.click()
                await driver.sleep(3000)
                let origem = path.join(dirorigem, 'notas_prazo.csv')
                let destino = path.join(dirdestino, `${numfat}.csv`)
                await filehandler.renomeiaarquivos(origem, destino)
                await driver.sleep(3000)
            }
        }
    }catch(err){
        console.log(`Erro ao abrir pagina: ${err}`)
    }finally{
        console.log('Finally!!')
        await driver.quit()
    }
}

WebScraping()