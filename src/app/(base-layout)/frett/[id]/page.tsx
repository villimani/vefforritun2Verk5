import { notFound } from 'next/navigation';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { log } from 'console';
import { revalidateTag } from 'next/cache';

// Define the query to fetch both frettaheader and its linked frett
const query = graphql(
    /* GraphQL */ `
      query FrettaHeader($id: ItemId) {
        frett(filter: { frettaheader: { eq: $id } }) {
          id
          frettaheiti
          innihaldfrettar
          _status
          _firstPublishedAt
          frettaheader {
            id
          }
        }
        
        _allFrettaheadersMeta {
          count
        }
      }
    `,
    []
  );



  export default async function FrettPage({ params }: { params: Promise<{ id: string }> }) {

    revalidateTag('datocms')

    const{id}= await params;
    
  
    const { frett } = await executeQuery(query, { variables: { id: id } }) as {
        frett: {
          id: string;
          frettaheiti: string;
          innihaldfrettar: string;
          _status: string;
          _firstPublishedAt: string;
        } | null;
      };
      
    if (!frett) {
      notFound();
    }
  
    return (
     <div>
        <h1>{frett.frettaheiti}</h1>
        <p>{frett.innihaldfrettar}</p>
      </div>
    );
  }