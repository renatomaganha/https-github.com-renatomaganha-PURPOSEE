import React from 'react';
import { UserProfile, Report, SupportTicket } from '../types';

interface DashboardProps {
    users: UserProfile[];
    reports: Report[];
    supportTickets: SupportTicket[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: string; isCurrency?: boolean }> = ({ title, value, description, isCurrency }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-3xl font-black text-slate-800">
            {isCurrency ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
        </p>
        <p className="text-xs font-medium text-slate-400 mt-1">{description}</p>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ users, reports, supportTickets }) => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.isPremium).length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    
    // Calcular novos usuários nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = users.filter(u => u.created_at && new Date(u.created_at) > thirtyDaysAgo).length;

    // Receita estimada (exemplo: R$ 29,90 por premium)
    const estimatedRevenue = premiumUsers * 29.90;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 mb-1">Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium">Visão geral em tempo real da sua plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total de Usuários" 
                    value={totalUsers.toLocaleString('pt-BR')} 
                    description="Membros na base de dados" 
                />
                <StatCard 
                    title="Assinantes Premium" 
                    value={premiumUsers.toLocaleString('pt-BR')}
                    description={`${((premiumUsers / (totalUsers || 1)) * 100).toFixed(1)}% de conversão`} 
                />
                <StatCard 
                    title="Receita Est. (Mês)" 
                    value={estimatedRevenue}
                    description="Baseado em assinaturas ativas" 
                    isCurrency
                />
                <StatCard 
                    title="Novos (30 dias)" 
                    value={newUsers.toLocaleString('pt-BR')}
                    description="Crescimento mensal" 
                />
            </div>

             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800">Atividade Recente</h2>
                        <span className="text-[10px] font-black text-sky-500 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">Tempo Real</span>
                    </div>
                    <div className="space-y-4">
                        {users.slice(0, 5).map((user, i) => (
                            <div key={user.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                                        {user.photos[0] ? (
                                            <img src={user.photos[0]} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black">?</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-700 leading-none mb-1">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">Entrou na comunidade</p>
                                    </div>
                                </div>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Recente'}
                                </span>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <p className="text-center py-10 text-slate-400 font-medium italic">Nenhuma atividade registrada ainda.</p>
                        )}
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-6 rotate-3">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <h3 className="font-black text-xl text-slate-800 mb-2">Saúde da Plataforma</h3>
                    <p className="text-slate-500 text-sm font-medium max-w-[280px]">
                        {totalUsers > 0 
                            ? `Você tem ${verifiedUsers} usuários verificados e ${reports.filter(r => r.status === 'Pendente').length} denúncias pendentes.`
                            : "Aguardando os primeiros cadastros para gerar insights de crescimento."}
                    </p>
                    <div className="mt-8 flex gap-2">
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Verificados</p>
                            <p className="font-black text-slate-700">{verifiedUsers}</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Denúncias</p>
                            <p className="font-black text-slate-700">{reports.length}</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tickets</p>
                            <p className="font-black text-slate-700">{supportTickets.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
