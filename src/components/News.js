import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {

  const [articles, setAritcles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

  const capitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // ✅ FIRST LOAD
  const updateNews = async () => {
    try {
      setLoading(true);

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=1&apikey=${API_KEY}`;

      let response = await fetch(url);
      let data = await response.json();

      if (data.articles && data.articles.length > 0) {
        setAritcles(data.articles);
        setPage(1);
        setHasMore(true); // reset
      } else {
        setAritcles([]);
        setHasMore(false);
      }

      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setHasMore(false);
    }
  };

  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  // ✅ LOAD MORE ON SCROLL
  const fetchMoreData = async () => {
    try {
      if (!hasMore) return;

      const nextPage = page + 1;

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=${nextPage}&apikey=${API_KEY}`;

      let response = await fetch(url);
      let data = await response.json();

      // ❌ No more news → stop forever
      if (!data.articles || data.articles.length === 0) {
        setHasMore(false);
        return;
      }

      // ✅ Append news
      setAritcles(prev => prev.concat(data.articles));
      setPage(nextPage);

    } catch (error) {
      console.error(error);
      setHasMore(false);
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
        hasMore={hasMore}
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

      {/* ✅ Show once when finished */}
      {!hasMore && articles.length > 0 && (
        <h4 className="text-center my-4">
          No more news for today ✅
        </h4>
      )}
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