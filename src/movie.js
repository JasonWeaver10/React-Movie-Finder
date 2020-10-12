class MovieFinder extends React.Component {
    constructor(props) {
        super();
        this.state = {
            searchTerm: '',
            results: [],
            error: ''

        };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange (event) {
        this.setState ({ searchTerm: event.target.value });
    }
     
    handleSubmit(event) {
        event.preventDefault();
        let { searchTerm } = this.state;  // ES6 destructuring
        searchTerm = searchTerm.trim();  // clean the string
        if (!searchTerm) {  // make sure the value isn't an empty string
          return;  // early return
        } 
      
  const checkStatus = (response) => {
    if (response.ok) {
      // .ok returns true if response status is 200-299
      return response;
    }
    throw new Error('Request was either a 404 or 500');
  }
  
  const json = (response) => response.json()
  
  fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=2cc249d4`)
    .then(checkStatus)
    .then(json)
    .then(data => {
      if (data.Response === 'False') {
        throw new Error(data.Error);
      }
  
      if (data.Response === 'True' && data.Search) {
        this.setState({ results: data.Search, error: '' });
      }
    })

    .catch(error => {
      this.setState({ error: error.message });
      console.log(error);
    }) 
    
} 

    render() {
        const { searchTerm, results, error } = this.state;

        return (
            <div className = "container">
                <div className = "row">
                    <div className = "col-12">
                        <form onSubmit = {this.handleSubmit} className = "form-inline my-4">
                            <input
                            type="text"
                            className="form-control mr-sm-2"
                            placeholder="frozen"
                            value={searchTerm}
                            onChange={this.handleChange}
                            />
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                        {(() => {
                            if (error) {
                                return error;
                            }
                            return results.map((movie) => {
                                return <Movie key={movie.imdbID} movie={movie} />;
                            })
                        })()}
                    </div>
                </div>
            </div>
        )
    }
}
const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster, Plot } = props.movie; 

    return (
    <div className="row">
        <div className="col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <img src={Poster} className="img-fluid" />
        </a>
        </div>
        <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <h4>{Title}</h4>
            <p>{Type} | {Year}</p>
            <p>{Plot}</p>
        </a>
        </div>
    </div>
    )
}

ReactDOM.render(
    <MovieFinder />,
    document.getElementById('root')
  );
 