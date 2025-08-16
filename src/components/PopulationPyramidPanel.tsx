import React from 'react';
import { ChartPieIcon, UsersIcon } from './Icons';
import { PopulationPyramidData, PopulationDataPoint } from '../types';
import { Tooltip } from 'react-tooltip';


const PopulationPyramidPanel: React.FC<{ data: PopulationPyramidData, countryName: string }> = ({ data, countryName }) => {
    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    const hasData = data && data.pyramid && data.pyramid.length > 0;

    if (!hasData) {
        return (
            <div className="text-center p-16">
                <ChartPieIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No Population Data</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary max-w-md mx-auto">{`Could not retrieve population pyramid data for ${countryName}.`}</p>
                {data.message && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {data.message}</p>}
            </div>
        );
    }
    
    const maxPopulationInGroup = Math.max(...data.pyramid.map(p => Math.max(p.male, p.female)));

    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-analyst-border">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary">Population Pyramid</h2>
                <p className="text-slate-500 dark:text-analyst-text-secondary mt-1">{`Demographic breakdown for ${data.country} in ${data.year}.`}</p>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex justify-between items-center bg-slate-100 dark:bg-analyst-input/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-analyst-text-primary">Total Population</h3>
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-analyst-accent"/>
                        <p className="text-2xl font-bold text-slate-900 dark:text-analyst-text-primary">{formatNumber(data.totalPopulation)}</p>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex justify-between items-center mb-2 text-sm font-semibold text-slate-700 dark:text-analyst-text-primary">
                        <span className="w-[45%] text-left">Male</span>
                        <span className="w-[10%] text-center">Age Group</span>
                        <span className="w-[45%] text-right">Female</span>
                    </div>

                    <div className="space-y-1">
                        {data.pyramid.map((group, index) => (
                           <div key={group.age} className="flex items-center justify-between group">
                               {/* Male Bar */}
                               <div className="w-[45%] flex justify-end items-center">
                                    <div 
                                        className="h-6 bg-blue-500/80 dark:bg-analyst-accent/60 rounded-l-md transition-all duration-300 group-hover:bg-analyst-accent"
                                        style={{ width: `${(group.male / maxPopulationInGroup) * 100}%` }}
                                        data-tooltip-id="pyramid-tooltip"
                                        data-tooltip-content={`Male ${group.age}: ${formatNumber(group.male)}`}
                                    ></div>
                               </div>

                               {/* Age Group Label */}
                               <div className="w-[10%] text-center text-xs font-mono text-slate-500 dark:text-analyst-text-secondary px-1">{group.age}</div>

                               {/* Female Bar */}
                               <div className="w-[45%] flex justify-start items-center">
                                    <div 
                                        className="h-6 bg-pink-500/80 dark:bg-pink-500/60 rounded-r-md transition-all duration-300 group-hover:bg-pink-500"
                                        style={{ width: `${(group.female / maxPopulationInGroup) * 100}%` }}
                                        data-tooltip-id="pyramid-tooltip"
                                        data-tooltip-content={`Female ${group.age}: ${formatNumber(group.female)}`}
                                    ></div>
                               </div>
                           </div>
                        ))}
                    </div>
                     <div className="flex justify-between items-center mt-2 text-xs font-mono text-slate-500 dark:text-analyst-text-secondary">
                        <span className="w-[45%] text-left">{formatNumber(maxPopulationInGroup)}</span>
                        <span className="w-[10%] text-center">Population</span>
                        <span className="w-[45%] text-right">{formatNumber(maxPopulationInGroup)}</span>
                    </div>
                </div>
            </div>
             <Tooltip id="pyramid-tooltip" className="!bg-analyst-sidebar !text-analyst-text-primary rounded-md shadow-lg !border !border-analyst-border !text-sm" />
        </div>
    );
};

export default PopulationPyramidPanel;