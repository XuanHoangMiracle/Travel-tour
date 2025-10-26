// chat/generateEmbeddings.js
import mongoose from 'mongoose';
import ollama from 'ollama';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('🔗 Connecting to MongoDB Atlas...');

// Kết nối đến MongoDB Atlas
await mongoose.connect(process.env.MONGODB_URL);

console.log('✅ Connected to MongoDB');
console.log('📊 Database:', mongoose.connection.db.databaseName);

const generateEmbedding = async (text) => {
  try {
    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: text
    });
    return response.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

const generateEmbeddingsForAllTours = async () => {
  try {
    // Truy cập trực tiếp collection 'tours'
    const db = mongoose.connection.db;
    const toursCollection = db.collection('tours');
    
    // Đếm tổng số documents
    const totalCount = await toursCollection.countDocuments();
    console.log(`\n📊 Total tours in collection: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('⚠️ No tours found in collection!');
      return;
    }
    
    // Lấy tất cả tours (không filter) để xem trạng thái embedding
    const allTours = await toursCollection.find({}).toArray();
    
    console.log('\n🔍 Checking embedding status...');
    let toursNeedingEmbedding = [];
    
    allTours.forEach((tour, idx) => {
      const hasEmbedding = tour.embedding && Array.isArray(tour.embedding) && tour.embedding.length > 0;
      console.log(`   ${idx + 1}. ${tour.name} - ${hasEmbedding ? '✅ Has embedding (' + tour.embedding.length + ' dims)' : '❌ No embedding'}`);
      
      if (!hasEmbedding) {
        toursNeedingEmbedding.push(tour);
      }
    });
    
    console.log(`\n📝 Tours needing embedding: ${toursNeedingEmbedding.length}`);

    if (toursNeedingEmbedding.length === 0) {
      console.log('✨ All tours already have embeddings!');
      return;
    }

    let updatedCount = 0;

    for (let i = 0; i < toursNeedingEmbedding.length; i++) {
      const tour = toursNeedingEmbedding[i];
      
      // Tạo text từ 5 trường: name, location, price, time, guest
      const textParts = [
        `Tên tour: ${tour.name}`,
        `Địa điểm: ${tour.location}`,
        `Giá: ${tour.price ? tour.price.toLocaleString('vi-VN') + ' VNĐ' : 'Liên hệ'}`,
        `Thời gian: ${tour.time}`,
        `Số khách: ${tour.guest} người`
      ];
      
      const textToEmbed = textParts.join('. ');
      
      console.log(`\n📝 Processing ${i + 1}/${toursNeedingEmbedding.length}: ${tour.name}`);
      console.log(`📄 Text: ${textToEmbed}`);
      
      try {
        const embedding = await generateEmbedding(textToEmbed);
        
        console.log(`✅ Generated embedding (${embedding.length} dimensions)`);
        
        // Cập nhật tour
        await toursCollection.updateOne(
          { _id: tour._id },
          { 
            $set: { 
              embedding: embedding,
              locationLowercase: tour.location?.toLowerCase()
            } 
          }
        );
        
        console.log(`💾 Saved embedding for: ${tour.name}`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Error processing ${tour.name}:`, error.message);
      }
      
      // Delay để tránh overload
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n✨ Processing completed!`);
    console.log(`📊 Successfully updated: ${updatedCount}/${toursNeedingEmbedding.length} tours`);
    
    // Verify kết quả cuối cùng
    const withEmbedding = await toursCollection.countDocuments({ 
      embedding: { $exists: true, $not: { $size: 0 } } 
    });
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total tours: ${totalCount}`);
    console.log(`   Tours with embeddings: ${withEmbedding}`);
    console.log(`   Tours without embeddings: ${totalCount - withEmbedding}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

generateEmbeddingsForAllTours();
