import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = "1f260844fc85760ac53657606b7748af";

  const capitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ✅ FIRST LOAD
  const updateNews = async () => {
    try {
      setLoading(true);

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=1&apikey=${API_KEY}`;

      let response = await fetch(url);

      // ✅ HANDLE 429 ERROR
      if (response.status === 429) {
        console.log("API limit reached");
        setHasMore(false);
        setLoading(false);
        return;
      }

      let data = await response.json();

      if (!data.articles || data.articles.length === 0) {
        setArticles([]);
        setHasMore(false);
      } else {
        setArticles(data.articles);
        setPage(1);
        setHasMore(true);
      }

      setLoading(false);

    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
      setHasMore(false);
    }
  };

  // ✅ RUN ONLY ON CATEGORY CHANGE
  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  // ✅ LOAD MORE (SCROLL)
  const fetchMoreData = async () => {
    try {
      if (!hasMore) return;

      const nextPage = page + 1;

      // ✅ LIMIT REQUESTS (avoid 429)
      if (nextPage > 5) {
        setHasMore(false);
        return;
      }

      let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=${nextPage}&apikey=${API_KEY}`;

      let response = await fetch(url);

      // ✅ HANDLE 429 AGAIN
      if (response.status === 429) {
        console.log("API limit reached");
        setHasMore(false);
        return;
      }

      let data = await response.json();

      // ❌ no more news
      if (!data.articles || data.articles.length === 0) {
        setHasMore(false);
        return;
      }

      // ✅ append news
      setArticles(prev => prev.concat(data.articles));
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

      {/* ✅ SHOW ONLY ONCE WHEN END */}
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