from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-mpnet-base-v2',cache_folder='.')


if __name__=="__main__":
    sentences_1 = ['{"item_name":"bread"}']
    sentences_2 = ['{"item_name":"food"}']
    embeddings_1 = model.encode(sentences_1, normalize_embeddings=False)
    embeddings_2 = model.encode(sentences_2, normalize_embeddings=False)
    similarity = model.similarity(embeddings_1,embeddings_2)
    print(similarity)

