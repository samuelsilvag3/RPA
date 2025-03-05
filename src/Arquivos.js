import {rename} from 'fs'

export class Arquivos{
  async renomeiaarquivos(origem, destino){
    console.log(`Origem: ${origem}`)
    console.log(`Destino: ${destino}`)

    rename(origem, destino, (err) => {
      if(err){
        console.log(err)
      }
    })
  }
}

export default Arquivos