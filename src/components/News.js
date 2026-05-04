import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {

  const [articles, setAritcles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const updateNews = async () => {
    try {
      if (loading) return;

      setLoading(true);

      // ✅ CALL YOUR BACKEND (NOT GNEWS DIRECTLY)
      let url = `/api/news?category=${props.category}&page=1`;

      let data = await fetch(url);
      let parsedData = await data.json();

      if (!parsedData.articles) {
        setAritcles([]);
        setTotalResults(0);
        setLoading(false);
        return;
      }

      setAritcles(parsedData.articles);
      setTotalResults(parsedData.totalArticles || parsedData.articles.length);
      setPage(1);

      setLoading(false);

    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;

      // ✅ BACKEND CALL
      let url = `/api/news?category=${props.category}&page=${nextPage}`;

      let data = await fetch(url);
      let parsedData = await data.json();

      if (!parsedData.articles) return;

      setAritcles(prev => prev.concat(parsedData.articles));
      setTotalResults(parsedData.totalArticles || parsedData.articles.length);
      setPage(nextPage);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className='text-center' style={{ margin: '70px' }}>
        NewsMonkey - Top {capitalizeFirstletter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      {!loading && articles.length === 0 && (
        <h3 className="text-center">No news available 😔</h3>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className='container'>
          <div className="row">

            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewItem
                    title={element.title || ""}
                    description={element.description || ""}
                    imageUrl={element.image}
                    newsurl={element.url}
                    author={element.source?.name}
                    date={element.publishedAt}
                    source={element.source?.name}
                  />
                </div>
              )
            })}

          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

News.defaultProps = {
  country: 'us',
  pageSize: 5,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News;