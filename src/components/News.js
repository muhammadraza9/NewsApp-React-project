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

  const capitalizeFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };

  const fetchNews = async (pageNumber) => {
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=us&max=${props.pageSize}&page=${pageNumber}&token=1f260844fc85760ac53657606b7748af`;

      const response = await fetch(url);

      if (response.status === 429) {
        console.log("Rate limit reached");
        setHasMore(false);
        return { articles: [] };
      }

      const data = await response.json();
      return { articles: data.articles || [] };

    } catch (error) {
      console.error("Fetch Error:", error);
      return { articles: [] };
    }
  };

  const updateNews = async () => {
    setLoading(true);
    const data = await fetchNews(1);
    if (data.articles.length === 0) {
      setArticles([]);
      setHasMore(false);
    } else {
      setArticles(data.articles);
      setPage(1);
      setHasMore(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const fetchMoreData = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    if (nextPage > 5) {
      setHasMore(false);
      return;
    }
    const data = await fetchNews(nextPage);
    if (data.articles.length === 0) {
      setHasMore(false);
      return;
    }
    setArticles(prev => [...prev, ...data.articles]);
    setPage(nextPage);
  };

  return (
    <>
      <h1 className='text-center' style={{ margin: '70px' }}>
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
        <div className='container'>
          <div className="row">
            {articles.map((element, index) => (
              <div className="col-md-4" key={element.url || index}>
                <NewItem
                  title={element.title || "No Title"}
                  description={element.description || "No Description"}
                  imageUrl={element.image || "https://via.placeholder.com/300"}
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