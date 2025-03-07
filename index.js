import {Builder, Browser, By, until, Key} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import FileHandler from './src/Arquivos.js'
import path from 'path'
import 'dotenv/config'

async function WebScraping (){
    let dirorigem = 'Y:\\Downloads'
    let dirdestino = 'Y:\\FrotaFlex'
    let filehandler = new FileHandler()
    let opts = new chrome.Options()
    let prefs = {"download.default_directory": "Y:\\Downloads"}
    opts.setUserPreferences(prefs)
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(opts).build()
    try{
        await driver.manage().setTimeouts({implicit: 30000})
        await driver.get('https://graal.frotaflex.com.br/')
        await driver.wait(until.titleIs('Entrar | FrotaFlex'), 30000)
        let usuario = await driver.findElement(By.xpath('//*[@id="user-field"]'))
        let senha = await driver.findElement(By.xpath('//*[@id="pass-field"]'))
        let btnlogin = await driver.findElement(By.xpath('//*[@id="confirm-btn"]'))
        await usuario.sendKeys(process.env.FROTAFLEX_USER)
        await senha.sendKeys(process.env.FROTAFLEX_PASSWORD)
        await btnlogin.click()
        await driver.sleep(5000)

        await driver.navigate().to('https://graal.frotaflex.com.br/faturas')
        await driver.wait(until.elementLocated(By.xpath('//*[@id="ROOT-2521314"]/vaadin-app-layout')),30000)
        let faturas = await driver.findElements(By.className('card-fatura'))
        let dia = new Date().toLocaleDateString()
        for(let i=0; i< 5; i++){
            let numfat = await faturas[i].findElement(By.className('numtitulo')).getText()
            let dtaemissao = await faturas[i].findElement(By.className('dtaemissao')).getText()
            console.log(dia)
            console.log(dtaemissao)
            if(dia == dtaemissao){
                console.log('Entrou!!!!')
                let xpBtnFatura = `//*[@id="ROOT-2521314"]/vaadin-app-layout/div/div[2]/div[2]/div[${i+1}]/div[2]/vaadin-button[3]`
                let btnFatura = await faturas[i].findElement(By.xpath(xpBtnFatura))
                await btnFatura.click()
                await driver.wait(until.elementLocated(By.xpath('//*[@id="overlay"]')),30000)
                let btnFatCliente = await driver.findElement(By.xpath('//*[@id="overlay"]/div/vaadin-button[1]'))
                await btnFatCliente.click()
                await driver.sleep(3000)
                await driver.actions()
                .sendKeys(Key.TAB)
                .sendKeys(Key.TAB)
                .sendKeys(Key.ENTER)
                .perform()
                await driver.sleep(3000)
                let btndownload = await driver.findElement(By.xpath('//*[@id="overlay"]/div/vaadin-vertical-layout/vaadin-horizontal-layout/vaadin-button[8]'))
                await btndownload.click()
                await driver.sleep(3000)
                await driver.actions()
                .sendKeys(Key.ESCAPE)
                .perform()
                await driver.sleep(1000)
                await driver.actions()
                .sendKeys(Key.ESCAPE)
                .perform()
                await driver.sleep(1000)
                await driver.actions()
                .sendKeys(Key.ESCAPE)
                .perform()
                let origem = path.join(dirorigem, 'fatura_cliente.csv')
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