const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());
const mongoose = require('mongoose')
const PORT = process.env.PORT
mongoose.connect("mongodb://localhost:27017/Flawer", { useNewUrlParser: true, useUnifiedTopology: true });


const arrayScema = mongoose.Schema({
    instructions: String,
    photo: String,
    name: String,

})

const emailschema = mongoose.Schema({
    email: String,
    flawerArry: [arrayScema]
})


const FlawerModel = mongoose.model('Flawer', emailschema);

const seed = () => {
    let data = new FlawerModel({
        email: 'adhamalomari909@gmail.com',
        flawerArry: [{

            instructions: "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
            photo: "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
            name: "Azalea"

        }]

    })
    data.save()
}
// seed()


const seed2 = () => {
    let data = new FlawerModel({
        email: 'roaa.abualeeqa@gmail.com',
        flawerArry: [{

            instructions: "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
            photo: "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
            name: "Azalea"

        }]

    })
    data.save()
}
// seed2();


class Flawer {
    constructor(item) {
        this.instructions = item.instructions,
            this.photo = item.photo,
            this.name = item.name

    }
}



const allData = (req, res) => {
    let url = ('https://flowers-api-13.herokuapp.com/getFlowers')
    axios.get(url).then(item => {
        let result = item.data.flowerslist.map(data => {
            return new Flawer(data)
        })
        res.send(result)
    }).catch(err => console.log(err))

}

const fromDB = (req, res) => {
    const email = req.query.email
    FlawerModel.find({email: email }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data[0].flawerArry)
        }
    })

}

const test = (req, res) => {
    res.send('hello')
}

const addToDb = (req, res) => {
    let { email, instructions, photo, name } = req.body
    FlawerModel.find({ email: email }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const fav = {
                instructions: instructions,
                photo: photo,
                name: name
            }
            data[0].flawerArry.push(fav)
            data[0].save()
        }
        res.send(data[0])
    })

}

const deleteFav = (req, res) => {
    let email = req.query.email;
    let idx = req.params.idx;

    FlawerModel.findOne({ email: email }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data[0].flawerArry.splice(idx, 1)
            data.save()
        }
        res.send(data.flawerArry)

    })

}

const update = async (req, res) => {
    let { email, instructions, photo, name } = req.body
    let idx = req.params.idx;

    FlawerModel.findOne({ email: email }, (err, data) => {
        if (err) {
            res, send(err)
        }
        else {

            data.flawerArry.splice(idx, 1, {
                instructions: instructions,
                photo: photo,
                name: name,
            })
        }
    }
    )
}




server.get('/', test)
server.get('/allData', allData)
server.get('/fromDB', fromDB)
server.post('/addToDb', addToDb)
server.delete('/deleteFav/:idx', deleteFav)
server.put('/update/:idx', update)

server.listen(3030)
