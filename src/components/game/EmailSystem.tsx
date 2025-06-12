
import React, { useState, useEffect } from 'react';
import { Mail, Star, Trash2, Reply, Forward, Archive, Search } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  attachments?: string[];
  missionId?: string;
  priority: 'low' | 'medium' | 'high';
}

export const EmailSystem: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  useEffect(() => {
    // Initialize with some sample emails
    const initialEmails: Email[] = [
      {
        id: '1',
        from: 'bit@entropy.org',
        subject: 'Welcome to the Network',
        body: `Greetings, hacker.

Welcome to the underground network. Your journey into the digital frontier begins now.

Your first mission awaits. Check the missions panel for details.

Remember: Trust no one. Verify everything. Leave no trace.

- bit`,
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        starred: false,
        priority: 'high',
        missionId: 'tutorial_001'
      },
      {
        id: '2',
        from: 'naix@cyberfront.net',
        subject: 'Security Alert',
        body: `Warning: Increased security protocols detected on corporate networks.

Recommend using advanced evasion techniques. Update your tools.

New vulnerabilities discovered in SSH implementations. Exploit while available.

Stay safe out there.

- Naix`,
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        starred: true,
        priority: 'medium'
      },
      {
        id: '3',
        from: 'system@hacknet.os',
        subject: 'System Update Available',
        body: `HackNet OS Update v2.1.3

New features:
- Enhanced network scanning
- Improved stealth protocols
- Updated hacking tools

Update will be applied automatically.

- System`,
        timestamp: new Date(Date.now() - 86400000),
        read: false,
        starred: false,
        priority: 'low'
      }
    ];
    setEmails(initialEmails);
  }, []);

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return !email.read && matchesSearch;
      case 'starred':
        return email.starred && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-theme-textSecondary';
    }
  };

  const unreadCount = emails.filter(email => !email.read).length;

  return (
    <div className="h-full flex flex-col bg-theme-background text-theme-text">
      {/* Header */}
      <div className="p-4 bg-theme-surface border-b border-theme-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="text-theme-primary" size={24} />
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--theme-font-mono)' }}>
              Email System
            </h2>
            {unreadCount > 0 && (
              <span className="bg-theme-primary text-white px-2 py-1 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-textSecondary" size={16} />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text placeholder-theme-textSecondary focus:outline-none focus:border-theme-primary"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {['all', 'unread', 'starred'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-theme-primary text-white'
                  : 'bg-theme-surface text-theme-textSecondary hover:bg-theme-primary/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-1/3 border-r border-theme-border overflow-y-auto">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                markAsRead(email.id);
              }}
              className={`p-4 border-b border-theme-border cursor-pointer transition-colors hover:bg-theme-surface/50 ${
                selectedEmail?.id === email.id ? 'bg-theme-primary/10' : ''
              } ${!email.read ? 'bg-theme-surface/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium truncate ${!email.read ? 'font-bold' : ''}`}>
                      {email.from}
                    </span>
                    <span className={`text-xs ${getPriorityColor(email.priority)}`}>
                      ●
                    </span>
                  </div>
                  <h3 className={`text-sm truncate ${!email.read ? 'font-bold text-theme-text' : 'text-theme-textSecondary'}`}>
                    {email.subject}
                  </h3>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {email.starred && (
                    <Star className="text-yellow-400" size={14} fill="currentColor" />
                  )}
                  {!email.read && (
                    <div className="w-2 h-2 bg-theme-primary rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-xs text-theme-textSecondary truncate">
                {email.body.split('\n')[0]}
              </p>
              <div className="text-xs text-theme-textSecondary mt-1">
                {email.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {/* Email Content */}
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <>
              {/* Email Header */}
              <div className="p-4 bg-theme-surface border-b border-theme-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold mb-1">{selectedEmail.subject}</h2>
                    <p className="text-sm text-theme-textSecondary">
                      From: <span className="text-theme-text">{selectedEmail.from}</span>
                    </p>
                    <p className="text-xs text-theme-textSecondary">
                      {selectedEmail.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedEmail.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedEmail.starred
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-theme-textSecondary hover:text-yellow-400'
                      }`}
                    >
                      <Star size={18} fill={selectedEmail.starred ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="p-2 rounded-lg text-theme-textSecondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1 bg-theme-primary/10 text-theme-primary rounded-lg text-sm hover:bg-theme-primary/20 transition-colors">
                    <Reply size={14} />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 bg-theme-surface text-theme-textSecondary rounded-lg text-sm hover:bg-theme-primary/10 transition-colors">
                    <Forward size={14} />
                    Forward
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 bg-theme-surface text-theme-textSecondary rounded-lg text-sm hover:bg-theme-primary/10 transition-colors">
                    <Archive size={14} />
                    Archive
                  </button>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="whitespace-pre-wrap text-theme-text" style={{ fontFamily: 'var(--theme-font-mono)' }}>
                  {selectedEmail.body}
                </div>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 p-4 bg-theme-surface border border-theme-border rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="text-sm text-theme-primary hover:underline cursor-pointer">
                        📎 {attachment}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mission Link */}
                {selectedEmail.missionId && (
                  <div className="mt-6 p-4 bg-theme-primary/10 border border-theme-primary/30 rounded-lg">
                    <p className="text-sm text-theme-text mb-2">This email contains a mission assignment.</p>
                    <button
                      onClick={() => {
                        // Switch to missions panel
                        // This would be handled by the parent component
                        console.log('Switch to mission:', selectedEmail.missionId);
                      }}
                      className="px-4 py-2 bg-theme-primary text-white rounded-lg text-sm hover:bg-theme-primary/80 transition-colors"
                    >
                      View Mission Details
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-theme-textSecondary">
              <div className="text-center">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select an email to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
