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

  const API_KEY = "1f260844fc85760ac53657606b7748af";

  const capitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const updateNews = async () => {
    try {
      if (loading) return; // ✅ prevent duplicate calls

      setLoading(true);

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category.toLowerCase()}&lang=en&country=${props.country}&max=${props.pageSize}&page=1&apikey=${API_KEY}`;

      let data = await fetch(url);
      let parsedData = await data.json();

      setAritcles(parsedData.articles || []);
      setTotalResults(parsedData.totalArticles || 0);
      setPage(1);

      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ✅ FIXED useEffect
  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category.toLowerCase()}&lang=en&country=${props.country}&max=${props.pageSize}&page=${nextPage}&apikey=${API_KEY}`;

      let data = await fetch(url);
      let parsedData = await data.json();

      setAritcles(prev => prev.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalArticles || 0);
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

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className='container'>
          <div className="row">

            {articles.length > 0 && articles.map((element) => {
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