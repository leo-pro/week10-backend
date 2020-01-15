const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        const devs = await Dev.find();
        
        return response.json(devs);
    },
    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: "Point",
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        

        return response.json(dev);
    },
    //DESAFIOOOO
    async update(request, response){
        const  { _id, techs, latitude, longitude } = request.body;

        const techsArray = await parseStringAsArray(techs);

        const dev = await Dev.findById({_id}, error =>{
            if(error){
                return response.json({
                    message: "Esse Dev não existe ou está inativo!"
                })
            }
        })

        dev.techs = techsArray;
        dev.location.coordinates = [longitude, latitude]; 

        await dev.save();

        return response.json(dev);
    },
    async destroy(request, response){
        const _id = request.params.id

        // await Dev.findOne({ _id }, error =>{
        //     if(error){
        //         return response.json({ 
        //             message: "Esse Dev não existe ou está inativo!"
        //         });
        //     }
        // })

        await Dev.deleteOne({ _id }, (error) =>{
            if(error) return response.json({
                message: `Não foi possível deletar o ${_id}!`
            })

            console.log(_id + " deletado do banco de dados!")
        })

        return response.json({
            message: `${_id} deletado com sucesso!` 
        });
    },
}