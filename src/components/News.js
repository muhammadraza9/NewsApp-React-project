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

  // ✅ Single fetchNews with debug logs
  const fetchNews = useCallback(async (pageNumber) => {
    try {
      const url = `/api/news?category=${props.category}&page=${pageNumber}`;
      console.log("Fetching:", url);

      const response = await fetch(url);
      console.log("Status:", response.status);

      const raw = await response.text();
      console.log("Raw response:", raw);

      if (response.status === 429) {
        console.warn("Rate limit reached");
        setHasMore(false);
        return { articles: [], total: 0 };
      }

      const data = JSON.parse(raw);
      return {
        articles: data.articles || [],
        total: data.total || 0
      };

    } catch (error) {
      console.error("Fetch Error:", error);
      return { articles: [], total: 0 };
    }
  }, [props.category]);

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

  const fetchMoreData = useCallback(async () => {
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
  }, [page, hasMore, fetchNews]);

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