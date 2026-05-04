import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {

  const [articles, setAritcles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ ENV variable (must exist in .env)
  const API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

  const capitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const updateNews = async () => {
    try {
      setLoading(true);

      console.log("API KEY:", API_KEY); // debug

      // ✅ SIMPLE URL (no pagination)
      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category.toLowerCase()}&lang=en&country=${props.country}&max=${props.pageSize}&apikey=${API_KEY}`;

      let response = await fetch(url);
      let parsedData = await response.json();

      console.log(parsedData); // debug

      // ✅ handle API error
      if (parsedData.errors) {
        console.error("API Error:", parsedData.errors);
        setAritcles([]);
      } else {
        setAritcles(parsedData.articles || []);
      }

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

  // ❌ disable infinite scroll (causes issues with free API)
  const fetchMoreData = () => {};

  return (
    <>
      <h1 className='text-center' style={{ margin: '70px' }}>
        NewsMonkey - Top {capitalizeFirstletter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      {/* ✅ no news message */}
      {!loading && articles.length === 0 && (
        <h3 className="text-center">No news available 😔</h3>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={false}   // ❌ disabled
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