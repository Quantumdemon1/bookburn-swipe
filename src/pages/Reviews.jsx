import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

const Reviews = () => {
  // This would typically come from a database or API
  const reviews = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4, review: "A classic that never gets old. Fitzgerald's prose is simply beautiful." },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", rating: 5, review: "An important book that everyone should read. Scout's narrative is both heartwarming and thought-provoking." },
    { id: 3, title: "1984", author: "George Orwell", rating: 4, review: "A chilling dystopian novel that feels more relevant with each passing year." },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", rating: 4, review: "Austen's wit and social commentary shine in this beloved romance." },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", rating: 3, review: "A controversial classic. Holden's voice is unique, but not for everyone." },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle className="text-xl">{review.title}</CardTitle>
              <p className="text-sm text-gray-600">{review.author}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.review}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;