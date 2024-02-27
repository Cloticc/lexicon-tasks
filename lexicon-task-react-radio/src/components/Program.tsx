import '../styles/Program.css';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { fetchData } from '../api/fetchData';

// import React from 'react';



interface Pagination {
  page: number;
  size: number;
  totalhits: number;
  totalpages: number;
  nextpage: string;
}

interface SocialMediaPlatform {
  platform: string;
  platformurl: string;
}

interface ProgramCategory {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  programcategory: ProgramCategory;
  payoff: string;
  broadcastinfo: string;
  email: string;
  phone: string;
  programurl: string;
  programimage: string;
  programimagetemplate: string;
  programimagewide: string;
  programimagetemplatewide: string;
  socialimage: string;
  socialimagetemplate: string;
  socialmediaplatforms: SocialMediaPlatform[];
  channel: Channel;
  archived: boolean;
  hasondemand: boolean;
  haspod: boolean;
  responsibleeditor: string;
}

interface Sr {
  copyright: string;
  pagination: Pagination;
  programs: Program[];
}
export const Program: React.FC = () => {
  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  // const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProgramElementRef = useCallback((node: Element) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && selectedCategory !== null) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, selectedCategory]);


  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = Number(event.target.value);
    setSelectedCategory(selectedCategory);
  };


  useEffect(() => {
    const fetchProgramCategories = async () => {
      let page = 1;
      let totalPages = 1;
      let programCategories: ProgramCategory[] = [];

      while (page <= totalPages) {
        const { data, isLoading, error } = await fetchData(`programcategories?format=json&page=${page}`);

        // console.log('Data:', data);
        // console.log('Loading:', isLoading);
        // console.log('Error:', error);

        if (data) {
          programCategories = [...programCategories, ...data.programcategories];
          totalPages = data.pagination.totalpages;
        } else {
          setError('No program categories found');
        }

        setIsLoading(isLoading);
        if (error) {
          setError(error);
        }

        page++;
      }

      setProgramCategories(programCategories);
    };

    fetchProgramCategories();
  }, []);

  // useEffect(() => {
  //   const fetchPrograms = async () => {
  //     if (selectedCategory !== null) {
  //       setIsLoading(true);
  //       let page = 1;
  //       let totalPages = 1;
  //       let programs: Program[] = [];

  //       while (page <= totalPages) {
  //         try {
  //           const response = await fetch(`https://api.sr.se/api/v2/programs/index?programcategoryid=${selectedCategory}&format=json&page=${page}`);
  //           const data = await response.json();

  //           console.log(data);

  //           if (data) {
  //             programs = [...programs, ...data.programs];
  //             totalPages = data.pagination.totalpages;
  //           } else {
  //             setError('No programs found for this category');
  //           }
  //         } catch (error) {
  //           setError(`An error occurred: ${error}`)
  //           setIsLoading(false);
  //         }

  //         page++;
  //       }

  //       setPrograms(programs);
  //       setIsLoading(false);
  //     } else {
  //       setPrograms([]);
  //     }
  //   };

  //   fetchPrograms();
  // }, [selectedCategory]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (selectedCategory !== null) {
        setIsLoading(true);
        try {
          const response = await fetch(`https://api.sr.se/api/v2/programs/index?programcategoryid=${selectedCategory}&format=json&page=${page}`);
          const data = await response.json();
  // console.log('Data:', data);
  // console.log('Loading:', isLoading);
  // console.log('Error:', error);
  
          if (data) {
            setPrograms(prevPrograms => [...prevPrograms, ...data.programs]);
          } else {
            setError('No programs found for this category');
          } 
          
        } catch (error) {
          setError(`An error occurred: ${error}`)
        }
        setIsLoading(false);
      }
    };
  
    fetchPrograms();
  }, [selectedCategory, page]);
  
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="Program">
        <h2>Programs</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Program">
        <h2>Programs</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="Program">
      <h2>Programs</h2>
      <>
        <select value={selectedCategory?.toString()} onChange={handleCategoryChange}>
          <option value="">Select a category</option>
          {programCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <aside>
          <h2>Channels</h2>

          {programs.map((program, index) => (
            /* TODO: Fix card stuff */
            <li key={`${program.id}-${index}`} ref={index === programs.length - 1 ? lastProgramElementRef : null}>
              <img src={program.programimage} alt={program.name} />
              <h3>{program.channel.name}</h3>
              <p>{program.description}</p>
              <p>{program.broadcastinfo}</p>
            </li>
          ))}


          {/* <ul>
            {programs.map((program, index) => (
              <li key={program.id} ref={index === programs.length - 1 ? lastProgramElementRef : null}>
                <img src={program.programimage} alt={program.name} />
                <h3>{program.channel.name}</h3>
                <p>{program.description}</p>
                <p>{program.broadcastinfo}</p>
              </li>
            ))}
          </ul> */}

        </aside>
      </>

    </div>
  );
};