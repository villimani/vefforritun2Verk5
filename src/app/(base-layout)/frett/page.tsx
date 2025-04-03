import { graphql } from 'gql.tada';
import Link from 'next/link';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { notFound } from 'next/navigation';
import { readFragment } from 'gql.tada';
import { revalidateTag } from 'next/cache';


export const metadata = {
  title: 'Frettasíða',
};

const query = graphql(
  /* GraphQL */ `
    {
      allFrettaheaders {
        id
        frettaheiti
        _status
        _firstPublishedAt
      }

      _allFrettaheadersMeta {
        count
      }
    }
  `,
  []
);

export default async function FrettaPage() {

  revalidateTag('datocms')

  const { allFrettaheaders } = await executeQuery(query, {}) as {
    allFrettaheaders: Array<{
      id: string;
      frettaheiti: string;
      _status: string;
      _firstPublishedAt: string;
    }>;
  };
  

    if (!allFrettaheaders) {
      notFound();
    }
  
    return (
      <div>
        <h1>{"Fréttir Vikunnar"}</h1>
        <ul>
          {allFrettaheaders.map((frett) => (
            <li key={frett.id}>
              <Link href={`/frett/${frett.id}`}>
                {frett.frettaheiti}
              </Link>
            </li>
          ))}
        </ul>
        
      </div>
    );
}