import React, { Component } from "react";
import axios from 'axios'

import './IMDBSearch.css'
import MoviePoster from '../../components/MoviePoster/MoviePoster'
import Backdrop from '../../components/Backdrop/Backdrop'
import PopUp from '../../components/PopUp/PopUp'
import Spinner from '../../components/Spinner/Spinner'
class IMDBSearch extends Component {

    constructor(props){
        super(props)

        this.state={
            searchResult: [],
            searchInput:'',
            searching: false,
            errorMessage:'',
            nominatedList: [],
            showNominationCompleteMessage: false,
            animateNominate: false,
            searchedString: ''
            
        }
    }

    componentDidMount = () => {

        //fetch nominated list from local storage if it exists
        let nominatedList = window.localStorage.getItem('nominatedList')
        if(nominatedList !== null){
            nominatedList = JSON.parse(nominatedList)
            this.setState({nominatedList})
        }
    }

    handleInputChange = (event) =>{
        const {value, name} = event.target
        
        //setting state this way makes handleInputChange function
        //reusable for other inputs
        this.setState({[name]:value})
      }

      //Runs when the user clicks enter after typing in search string
    handleSearch = async (event) => {
        event.preventDefault()
        const {searchInput} = this.state
        this.setState({searching:true, error:false, searchedString: searchInput})
        
        //can't find a way to hide the key
        //I only know how to hide in environmental variables in
        //the back end
        const apiKey = '17b7bcf9';
        try{
            const result = await axios.get(`https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`)
            
            this.setState({searching: false})
            if(result.data && result.data.Response === 'True'){
                this.setState({searchResult:result.data.Search})
            } else{
                this.setState({error:true, errorMessage:result.data.Error, searchResult:[]})
            }
        }
        catch(err){
            this.setState({searching:false,error:true,errorMessage:'Something went wrong', searchResult:[]})
            console.log(err)
        }
        
    }

    //handles when user clicks on nominate
    handleNominate = (id,event)=> { 
        const tempNominatedList = [...this.state.nominatedList]
        const nominatedListLength = tempNominatedList.length
        
        //checks if the nominated list is upto 5
        if(nominatedListLength >= 5){
            this.setState({showNominationCompleteMessage:true})
        }
        else{
            //Get the nominated movie
            const tempList = [...this.state.searchResult]
            const movieIndex = tempList.findIndex(x => x.imdbID === id)
            const nominatedMovie = tempList[movieIndex]
            tempNominatedList.unshift(nominatedMovie)
            
            //save in the local storage
            window.localStorage.setItem('nominatedList',JSON.stringify(tempNominatedList))
            
            //update it in the state.
            // NB: If we are about to add one more and what we have in the state is 
            //already up to 4, then we should notify the user that it is complete after updating the 
            //state and making it 5

            //also, we will set off the animation as we are updating the state
            if(nominatedListLength >= 4){
                this.setState({
                            nominatedList: [nominatedMovie, ...this.state.nominatedList],
                            showNominationCompleteMessage: true,
                            animateNomination:true
                        })
            }
            else{
                this.setState({
                    nominatedList: [nominatedMovie, ...this.state.nominatedList],
                    animateNomination:true
                })
            }

            // we need to wait for the animation to complete before 
            // turning off the animation
            setTimeout(() =>{
                this.setState({animateNomination:false})
                },700)
        }      
    }

    handleRemove = (id, event)=> { 
        //remove from the list
        const tempNominatedList = [...this.state.nominatedList]
        const movieIndex = tempNominatedList.findIndex(x => x.imdbID === id)
        tempNominatedList.splice(movieIndex,1)
        
        //update the localStorage
        window.localStorage.setItem('nominatedList',JSON.stringify(tempNominatedList))

        //update the state
        this.setState({nominatedList: tempNominatedList})
    }
    
    //this is used to close the notification modal
    removeMessage = () => {
        this.setState({showNominationCompleteMessage:false,
                })
    }

    

    render = () =>{
        
        //get state values  
        const {error, errorMessage, searchResult, 
            nominatedList,
            showNominationCompleteMessage,
            searching, animateNomination,
            searchedString
            } = this.state  
        const resultLength = searchResult.length    
        const nominationCompleteMessage = 'You have completed 5 movie nominations and can no longer nominate more'
       
       
        return(
            <div className='IMDBSearch'>
                {
                    //backdrop and notification
                }
                <Backdrop show={showNominationCompleteMessage} 
                    backdropClicked = {this.removeMessage}
                    />
                {showNominationCompleteMessage ?
                    <PopUp success={true}
                        title='Nomination Complete'
                        message={nominationCompleteMessage}
                        handlePopUpOk={this.removeMessage}
                        />
                    :
                    null
                    }
                 

                <div className='title'>
                    <h2>The shoppies</h2>
                </div>
                <div className='center'>
                    <div className='search-panel'>
                    <h3>Movie title</h3>
                    <div className='search'>
                        <i className="fas fa-search"></i>
                        <form onSubmit = {this.handleSearch}>
                        <input type='text' 
                            onChange={this.handleInputChange}
                            name='searchInput'
                            placeholder='Enter the movie title and click Enter' />
                        </form>
                    </div>
                    </div>
                    <div className='lower-side'>
                      <div className='results'>
                          {
                          
                          //display error message if there is error
                          error ? 
                            <div className='error-message'>
                                <h3>{errorMessage}</h3>
                            </div>
                            :
                            null
                            }
                          {
                            //Display the spinner when fetching
                            //from imdb api
                            searching ? 
                            <Spinner spinnerSize={15}
                                message='searching movie ...'
                                color='green'
                                textSize={16}
                                 />
                            :
                            //check for the result is empty
                            resultLength === 0 ?
                            <div className='no-result'>
                                <h3>Your searched movies will show here when you have a result.</h3>
                            </div>
                            :
                            <React.Fragment>
                                <h3>{`Results for "${searchedString}"` }</h3>
                                <ul>
                                    {searchResult.map(movie => {
                                        return <li><MoviePoster
                                                    key={movie.imdbID}
                                                    nominatedList={nominatedList}
                                                    movie={movie}
                                                    handleNominate = {this.handleNominate}
                                                    origin='search'
                                                    />
                                                </li>
                                    })}
                                    
                                </ul>
                            </React.Fragment>

                            
                          }
                        
                      </div>
                      <div className='nominations'>
                        <h3>Nomimations</h3>
                        <ul className={animateNomination ? 'movein':''} >
                            {
                            nominatedList.length === 0?
                            <div className='no-result'>
                                <h3>Your nominated movies will show here when you have done so.</h3>
                            </div>
                            :
                            nominatedList.map(movie => {
                                return <li><MoviePoster
                                            key={movie.imdbID}
                                            nominatedList={nominatedList}
                                            movie={movie}
                                            handleRemove = {this.handleRemove}
                                            origin='nomination' 
                                            />
                                        </li>
                                })}
                        </ul>
                      </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default IMDBSearch