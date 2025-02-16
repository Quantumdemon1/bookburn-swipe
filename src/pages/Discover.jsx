import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '@/utils/recommendationEngine';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, MessageSquare } from 'lucide-react';
const Discover = () => {
  const [recommendedBooks, setRecommendedBooks] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    const books = getRecommendations(1, 5);
    setRecommendedBooks(books);
  }, []);
  const handleRateClick = bookId => {
    navigate('/ratings');
  };
  const handleReviewClick = bookId => {
    navigate('/reviews');
  };
  return <div className="container mx-auto p-4 space-y-8 py-0 px-[210px]">
      <h1 className="text-3xl font-bold mb-6">Discover Books</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
        <div className="relative">
          <Carousel className="w-full max-w-screen-xl mx-auto">
            <CarouselContent>
              {recommendedBooks.map(book => <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
                        <img src={book.coverUrl} alt={book.title} className="object-cover w-full h-full hover:scale-55 transition-transform duration-200" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold truncate">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-sm line-clamp-2">{book.preview}</p>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleRateClick(book.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            Rate
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReviewClick(book.id)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4 py-0 px-0">
            <Star className="w-12 h-12 text-yellow-400" />
            <h3 className="text-xl font-semibold">Rate Books</h3>
            <p className="text-muted-foreground">Share your opinion and help others discover great books</p>
            <Button onClick={() => navigate('/ratings')}>Go to Ratings</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4 px-0 py-0">
            <MessageSquare className="w-12 h-12 text-blue-400" />
            <h3 className="text-xl font-semibold">Write Reviews</h3>
            <p className="text-muted-foreground">Share detailed thoughts and connect with other readers</p>
            <Button onClick={() => navigate('/reviews')}>Go to Reviews</Button>
          </CardContent>
        </Card>
      </section>
    </div>;
};
export default Discover;