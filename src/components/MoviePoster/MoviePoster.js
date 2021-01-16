import './MoviePoster.css'
import {useState} from 'react'

function MoviePoster(props){
    const {Poster, Title, Type, Year,imdbID} = props.movie
    const {nominatedList,origin,handleNominate,handleRemove} = props
    let movieIndex
    if(nominatedList !== undefined){
        movieIndex = nominatedList.findIndex(x => x.imdbID === imdbID)
    }

    const [animateRemoval,setAnimateRemoval] = useState(false)
    const [animateNomination, setAnimateNomination] = useState(false)
    
    const handleRemoveClicked = (id)=> (event)=>{

        //set off the animation and wait for some 0.5s before
        //continuing with the function
        setAnimateRemoval(true)
        setTimeout(function(){
            handleRemove(id)
        },500)
    }

    const handleNominateClicked = (id)=> (event)=>{

        //set off the animation and wait for some 0.5s before
        //continuing with the function
        setAnimateNomination(true)
        setTimeout(function(){
            handleNominate(id)
            setAnimateNomination(false)
        },500)
    }
 
 
    return(
        <div className= {animateRemoval || animateNomination ? 'moveout movie-poster':'movie-poster'}>
            <div className='poster-image'>
                <img alt='' src={Poster} />
            </div>
            <div className='poster-lower'>
                <div className='poster-info'>
                    <h3>{Title} - {Year}</h3>
                    <h3>Genre: {Type}</h3>
                </div> 
                <div className='poster-control'>
                    {origin==='search' ? 
                        <button disabled={(movieIndex !== -1)} onClick={handleNominateClicked(imdbID)} >Nominate</button>
                        :
                        <button  onClick={handleRemoveClicked(imdbID)} >Remove</button> }
                </div>   
                    

            </div>
        </div>
    )
}

export default MoviePoster