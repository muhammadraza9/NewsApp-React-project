import React, { useEffect, useState, useCallback, useRef } from 'react';
import NewItem from './NewItem';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from './Spinner';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingMore = useRef(false);

  const capitalizeFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };

  const fetchNews = useCallback(async (pageNumber) => {
    try {
      const token = process.env.REACT_APP_GNEWS_TOKEN;
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=${pageNumber}&token=${token}`;

      const response = await fetch(url);

      if (response.status === 429) {
        console.warn("Rate limit reached");
        setHasMore(false);
        return { articles: [] };
      }

      const data = await response.json();
      return { articles: data.articles || [] };

    } catch (error) {
      console.error("Fetch Error:", error);
      return { articles: [] };
    }
  }, [props.category, props.pageSize]);

  const updateNews = useCallback(async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    const data = await fetchNews(1);
    if (data.articles.length === 0) {
      setHasMore(false);
    }
    setArticles(data.articles);
    setLoading(false);
  }, [fetchNews]);

  useEffect(() => {
    updateNews();
  }, [updateNews]);

  // Fixed: no longer uses setPage inside useCallback — plain async function is correct here
  const fetchMoreData = async () => {
    if (!hasMore || isFetchingMore.current) return;
    isFetchingMore.current = true;

    const nextPage = page + 1;

    if (nextPage > 5) {
      setHasMore(false);
      isFetchingMore.current = false;
      return;
    }

    const data = await fetchNews(nextPage);

    if (data.articles.length === 0) {
      setHasMore(false);
    } else {
      setArticles(prev => [...prev, ...data.articles]);
      setPage(nextPage);
    }

    isFetchingMore.current = false;
  };

  return (
    <>
      <h1 className='text-center' style={{ margin: '20px 0' }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      {!loading && articles.length === 0 && (
        <h3 className="text-center">No news available</h3>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        <div className='container pt-2'>
          <div className="row align-items-stretch g-4">
            {articles.map((element, index) => (
              <div className="col-md-4 d-flex" key={element.url || index}>
                <NewItem
                  title={element.title || "No Title"}
                  description={element.description || "No Description"}
                  imageUrl={element.image || "https://placehold.co/600x400"}
                  newsurl={element.url}
                  author={element.source?.name || "Unknown"}
                  date={element.publishedAt}
                  source={element.source?.name || "Unknown"}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>

      {!hasMore && articles.length > 0 && (
        <h4 className="text-center my-4">No more news for today</h4>
      )}
    </>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 5,
  category: 'general'
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;