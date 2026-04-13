import React from 'react';
import { UserProfile, Report, SupportTicket } from '../types';

interface AnalyticsProps {
    users: UserProfile[];
    reports: Report[];
    supportTickets: SupportTicket[];
}

const FunnelStep: React.FC<{ step: string; value: number; percentage: number; color?: string; isTop?: boolean; isBottom?: boolean }> = ({ step, value, percentage, color = "bg-sky-500", isTop, isBottom }) => (
    <div className="flex items-center justify-center">
        <div 
            className={`
                ${color} text-white text-center font-bold py-4
                ${isTop ? 'rounded-t-lg' : ''}
                ${isBottom ? 'rounded-b-lg' : ''}
            `}
            style={{ width: `${percentage}%` }}
        >
            <p className="text-[10px] uppercase opacity-80">{step}</p>
            <p className="text-xl">{value.toLocaleString('pt-BR')}</p>
        </div>
    </div>
);

const RevenueBar: React.FC<{ label: string; amount: number; percentage: number; color: string }> = ({ label, amount, percentage, color }) => (
    <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-slate-700">{label}</span>
            <span className="text-slate-500 font-mono">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
            <div 
                className={`${color} h-4 rounded-full transition-all duration-1000`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);


export const Analytics: React.FC<AnalyticsProps> = ({ users, reports, supportTickets }) => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.isPremium).length;
    
    // Estimativa de receita simplificada
    const monthlyRevenue = premiumUsers * 29.90;
    const annualRevenue = monthlyRevenue * 12 * 0.7; // Exemplo de projeção

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 mb-1">Analytics & Finanças</h1>
                <p className="text-slate-500 text-sm font-medium">Dados detalhados sobre o crescimento e monetização.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribuição de Receita */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                        Receita Estimada
                    </h2>
                    <RevenueBar label="Assinaturas Premium" amount={monthlyRevenue} percentage={100} color="bg-emerald-500" />
                    
                    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 text-center italic font-medium">
                            Dica: Você tem {premiumUsers} usuários premium de um total de {totalUsers}. 
                            Uma taxa de conversão de {((premiumUsers / (totalUsers || 1)) * 100).toFixed(1)}%.
                        </p>
                    </div>
                </div>

                {/* Funil de Conversão */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path></svg>
                        Funil de Usuários
                    </h2>
                    <div className="space-y-1">
                        <FunnelStep step="Total de Membros" value={totalUsers} percentage={100} color="bg-slate-400" isTop />
                        <FunnelStep step="Usuários Verificados" value={users.filter(u => u.isVerified).length} percentage={Math.max(20, (users.filter(u => u.isVerified).length / (totalUsers || 1)) * 100)} color="bg-sky-400" />
                        <FunnelStep step="Membros Premium" value={premiumUsers} percentage={Math.max(10, (premiumUsers / (totalUsers || 1)) * 100)} color="bg-emerald-500" isBottom />
                    </div>
                    <div className="mt-8 flex justify-around text-center">
                        <div>
                            <p className="text-2xl font-black text-slate-800">{((premiumUsers / (totalUsers || 1)) * 100).toFixed(1)}%</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Conversão Premium</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800">{((users.filter(u => u.isVerified).length / (totalUsers || 1)) * 100).toFixed(1)}%</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Taxa de Verificação</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-800 mb-6">Saúde da Comunidade</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Denúncias Pendentes</p>
                        <p className="text-3xl font-black text-red-500">{reports.filter(r => r.status === 'Pendente').length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tickets de Suporte</p>
                        <p className="text-3xl font-black text-sky-500">{supportTickets.length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Média de Idade</p>
                        <p className="text-3xl font-black text-slate-800">
                            {totalUsers > 0 ? Math.round(users.reduce((acc, u) => acc + u.age, 0) / totalUsers) : 0} anos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
