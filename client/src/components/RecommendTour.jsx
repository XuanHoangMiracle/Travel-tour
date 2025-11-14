import React, { useState, useEffect } from 'react'
import TourCard from './TourCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendTour = () => {
    const { tours, searchedCities, user, isLoaded } = useAppContext(); 
    const [recommended, setRecommended] = useState([]);

    const calculateRecommendationScore = (tour) => {
        if (!searchedCities || searchedCities.length === 0) return 0;

        let score = 0;
        const tourLocationLower = tour.location?.toLowerCase() || '';

        searchedCities.forEach((city, index) => {
            const cityLower = city?.toLowerCase() || '';
            
            if (tourLocationLower === cityLower || 
                tourLocationLower.includes(cityLower) ||
                cityLower.includes(tourLocationLower)) {
                score += (searchedCities.length - index) * 10;
            }
        });

        if (tour.rating) {
            score += tour.rating * 2;
        }

        return score;
    };

    const filterAndSortTours = () => {
        if (!isLoaded) {
            setRecommended([]);
            return;
        }

        if (!user) {
            setRecommended([]);
            return;
        }

        if (!searchedCities || searchedCities.length === 0) {
            setRecommended([]);
            return;
        }

        const scoredTours = tours
            .map(tour => ({
                ...tour,
                score: calculateRecommendationScore(tour)
            }))
            .filter(tour => tour.score > 0) 
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        setRecommended(scoredTours);
    };

    useEffect(() => {
        filterAndSortTours();
    }, [tours, searchedCities, user, isLoaded]);

    if (!isLoaded || !user || !searchedCities || searchedCities.length === 0 || recommended.length === 0) {
        return null;
    }

    return (
        <div className='flex flex-col items-center px-6 text-blue-500 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title 
                title='ĐIỂM ĐẾN ĐỀ XUẤT CHO BẠN'
                subTitle={`Khám phá các tour và những địa điểm phù hợp với sở thích của bạn`}
            />

            <div className='flex flex-wrap items-center justify-center w-full gap-6 mt-15'>
                {recommended.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                ))}
            </div>
        </div>
    );
};

export default RecommendTour;
