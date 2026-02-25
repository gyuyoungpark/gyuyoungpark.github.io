import { useMemo, useState, type FormEvent } from 'react';
import type { Article, Author, CabinetItem, Producer, SiteContent, Tag } from '@/types';
import {
  hasAdminCredential,
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
  registerAdminCredential,
} from '@/lib/adminAuth';

interface AdminPanelProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  content: SiteContent;
  onClose: () => void;
  onLoginStateChange: (next: boolean) => void;
  onContentChange: (next: SiteContent) => void;
}

type TabKey = 'about' | 'tags' | 'articles' | 'producers' | 'cabinet';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function splitByComma(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toAuthors(csv: string, articleId: string): Author[] {
  return splitByComma(csv).map((name, index) => ({
    id: `${articleId}-author-${index + 1}`,
    name,
  }));
}

function toTags(csv: string, articleId: string): Tag[] {
  return splitByComma(csv).map((name, index) => ({
    id: `${articleId}-tag-${index + 1}`,
    name,
    color: 'tag-green',
  }));
}

export function AdminPanel({
  isOpen,
  isLoggedIn,
  content,
  onClose,
  onLoginStateChange,
  onContentChange,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [setupPasswordConfirm, setSetupPasswordConfirm] = useState('');
  const [authError, setAuthError] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const hasCredential = useMemo(() => hasAdminCredential(), [isOpen, isLoggedIn]);
  const shouldSetup = !hasCredential;

  if (!isOpen) {
    return null;
  }

  const saveAbout = (aboutDescription: string) => {
    onContentChange({
      ...content,
      aboutDescription,
    });
  };

  const updateTag = (id: string, name: string) => {
    onContentChange({
      ...content,
      tags: content.tags.map((tag) => (tag.id === id ? { ...tag, name } : tag)),
    });
  };

  const removeTag = (id: string) => {
    onContentChange({
      ...content,
      tags: content.tags.filter((tag) => tag.id !== id),
    });
  };

  const addTag = () => {
    const name = newTagName.trim();
    if (!name) {
      return;
    }
    onContentChange({
      ...content,
      tags: [...content.tags, { id: createId('tag'), name, color: 'tag-green' }],
    });
    setNewTagName('');
  };

  const updateArticle = (id: string, updater: (current: Article) => Article) => {
    onContentChange({
      ...content,
      articles: content.articles.map((article) =>
        article.id === id ? updater(article) : article
      ),
    });
  };

  const removeArticle = (id: string) => {
    onContentChange({
      ...content,
      articles: content.articles.filter((article) => article.id !== id),
    });
  };

  const addArticle = () => {
    const id = createId('article');
    onContentChange({
      ...content,
      articles: [
        ...content.articles,
        {
          id,
          title: '새 연구 제목',
          description: '내용을 입력하세요.',
          authors: [{ id: `${id}-author-1`, name: '작성자' }],
          tags: [{ id: `${id}-tag-1`, name: '태그', color: 'tag-green' }],
          category: '연구',
          isNew: true,
        },
      ],
    });
  };

  const updateProducer = (id: string, updater: (current: Producer) => Producer) => {
    onContentChange({
      ...content,
      producers: content.producers.map((producer) =>
        producer.id === id ? updater(producer) : producer
      ),
    });
  };

  const removeProducer = (id: string) => {
    onContentChange({
      ...content,
      producers: content.producers.filter((producer) => producer.id !== id),
    });
  };

  const addProducer = () => {
    onContentChange({
      ...content,
      producers: [
        ...content.producers,
        {
          id: createId('producer'),
          name: '새 활동 이름',
          role: '역할',
          bio: '소개를 입력하세요.',
        },
      ],
    });
  };

  const updateCabinetItem = (
    id: string,
    updater: (current: CabinetItem) => CabinetItem
  ) => {
    onContentChange({
      ...content,
      cabinetItems: content.cabinetItems.map((item) =>
        item.id === id ? updater(item) : item
      ),
    });
  };

  const removeCabinetItem = (id: string) => {
    onContentChange({
      ...content,
      cabinetItems: content.cabinetItems.filter((item) => item.id !== id),
    });
  };

  const addCabinetItem = () => {
    onContentChange({
      ...content,
      cabinetItems: [
        ...content.cabinetItems,
        {
          id: createId('cabinet'),
          title: '새 지식 제목',
          subtitle: '부제',
          author: '작성자',
          location: '위치',
          description: '설명을 입력하세요.',
        },
      ],
    });
  };

  const handleSetup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    if (!loginId.trim() || !loginPassword) {
      setAuthError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (loginPassword !== setupPasswordConfirm) {
      setAuthError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    registerAdminCredential(loginId, loginPassword);
    const success = loginAdmin(loginId, loginPassword);
    onLoginStateChange(success);
    if (!success) {
      setAuthError('관리자 초기 설정에 실패했습니다.');
    }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    const success = loginAdmin(loginId, loginPassword);
    if (!success) {
      setAuthError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    onLoginStateChange(true);
  };

  const handleLogout = () => {
    logoutAdmin();
    onLoginStateChange(isAdminLoggedIn());
    setAuthError('');
    setLoginPassword('');
  };

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'about', label: '소개글' },
    { key: 'tags', label: '연결' },
    { key: 'articles', label: '연구' },
    { key: 'producers', label: '활동' },
    { key: 'cabinet', label: '지식' },
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 p-3 sm:p-6">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden border border-zinc-300 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-300 px-4 py-3">
          <h2 className="text-sm font-semibold tracking-[0.08em] text-zinc-900">
            관리자 모드
          </h2>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:text-black"
              >
                로그아웃
              </button>
            )}
            <button
              onClick={onClose}
              className="border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:text-black"
            >
              닫기
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="mx-auto my-auto w-full max-w-md border border-zinc-300 p-5">
            <h3 className="text-base font-semibold text-zinc-900">
              {shouldSetup ? '관리자 계정 초기 설정' : '관리자 로그인'}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              이 로그인은 브라우저 로컬 저장소 기반입니다. 서버 인증은 아닙니다.
            </p>
            <form onSubmit={shouldSetup ? handleSetup : handleLogin} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-600">아이디</label>
                <input
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-600">비밀번호</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                />
              </div>
              {shouldSetup && (
                <div>
                  <label className="mb-1 block text-xs text-zinc-600">비밀번호 확인</label>
                  <input
                    type="password"
                    value={setupPasswordConfirm}
                    onChange={(event) => setSetupPasswordConfirm(event.target.value)}
                    className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                  />
                </div>
              )}
              {authError && <p className="text-xs text-rose-600">{authError}</p>}
              <button
                type="submit"
                className="w-full border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white"
              >
                {shouldSetup ? '초기 설정 완료' : '로그인'}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid h-full min-h-0 lg:grid-cols-[180px_1fr]">
            <aside className="border-b border-zinc-300 p-3 lg:border-b-0 lg:border-r">
              <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`whitespace-nowrap border px-3 py-2 text-xs ${
                      activeTab === tab.key
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 text-zinc-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            <section className="min-h-0 overflow-y-auto p-4 sm:p-5">
              {activeTab === 'about' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-900">소개글 수정</h3>
                  <textarea
                    value={content.aboutDescription}
                    onChange={(event) => saveAbout(event.target.value)}
                    rows={12}
                    className="w-full border border-zinc-300 px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                  />
                </div>
              )}

              {activeTab === 'tags' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-900">연결 수정/추가</h3>
                  <div className="space-y-2">
                    {content.tags.map((tag) => (
                      <div key={tag.id} className="flex gap-2">
                        <input
                          value={tag.name}
                          onChange={(event) => updateTag(tag.id, event.target.value)}
                          className="flex-1 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        />
                        <button
                          onClick={() => removeTag(tag.id)}
                          className="border border-rose-300 px-3 py-2 text-xs text-rose-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newTagName}
                      onChange={(event) => setNewTagName(event.target.value)}
                      placeholder="새 연결 키워드"
                      className="flex-1 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                    <button
                      onClick={addTag}
                      className="border border-zinc-300 px-3 py-2 text-xs text-zinc-700"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'articles' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900">연구 수정/추가</h3>
                    <button
                      onClick={addArticle}
                      className="border border-zinc-300 px-3 py-2 text-xs text-zinc-700"
                    >
                      연구 추가
                    </button>
                  </div>
                  <div className="space-y-3">
                    {content.articles.map((article) => (
                      <details key={article.id} className="border border-zinc-300 p-3" open>
                        <summary className="cursor-pointer text-sm font-medium text-zinc-900">
                          {article.title}
                        </summary>
                        <div className="mt-3 space-y-2">
                          <input
                            value={article.title}
                            onChange={(event) =>
                              updateArticle(article.id, (current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                            }
                            className="w-full border border-zinc-300 px-3 py-2 text-sm"
                            placeholder="제목"
                          />
                          <input
                            value={article.category ?? ''}
                            onChange={(event) =>
                              updateArticle(article.id, (current) => ({
                                ...current,
                                category: event.target.value,
                              }))
                            }
                            className="w-full border border-zinc-300 px-3 py-2 text-sm"
                            placeholder="분류"
                          />
                          <input
                            value={article.authors.map((author) => author.name).join(', ')}
                            onChange={(event) =>
                              updateArticle(article.id, (current) => ({
                                ...current,
                                authors: toAuthors(event.target.value, current.id),
                              }))
                            }
                            className="w-full border border-zinc-300 px-3 py-2 text-sm"
                            placeholder="작성자 (콤마로 구분)"
                          />
                          <input
                            value={article.tags.map((tag) => tag.name).join(', ')}
                            onChange={(event) =>
                              updateArticle(article.id, (current) => ({
                                ...current,
                                tags: toTags(event.target.value, current.id),
                              }))
                            }
                            className="w-full border border-zinc-300 px-3 py-2 text-sm"
                            placeholder="태그 (콤마로 구분)"
                          />
                          <textarea
                            value={article.description}
                            onChange={(event) =>
                              updateArticle(article.id, (current) => ({
                                ...current,
                                description: event.target.value,
                              }))
                            }
                            rows={5}
                            className="w-full border border-zinc-300 px-3 py-2 text-sm leading-6"
                            placeholder="본문"
                          />
                          <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
                            <input
                              type="checkbox"
                              checked={Boolean(article.isNew)}
                              onChange={(event) =>
                                updateArticle(article.id, (current) => ({
                                  ...current,
                                  isNew: event.target.checked,
                                }))
                              }
                            />
                            NEW 표시
                          </label>
                          <div>
                            <button
                              onClick={() => removeArticle(article.id)}
                              className="border border-rose-300 px-3 py-1.5 text-xs text-rose-600"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'producers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900">활동 수정/추가</h3>
                    <button
                      onClick={addProducer}
                      className="border border-zinc-300 px-3 py-2 text-xs text-zinc-700"
                    >
                      활동 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {content.producers.map((producer) => (
                      <div key={producer.id} className="space-y-2 border border-zinc-300 p-3">
                        <input
                          value={producer.name}
                          onChange={(event) =>
                            updateProducer(producer.id, (current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="이름"
                        />
                        <input
                          value={producer.role ?? ''}
                          onChange={(event) =>
                            updateProducer(producer.id, (current) => ({
                              ...current,
                              role: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="역할"
                        />
                        <textarea
                          value={producer.bio}
                          onChange={(event) =>
                            updateProducer(producer.id, (current) => ({
                              ...current,
                              bio: event.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full border border-zinc-300 px-3 py-2 text-sm leading-6"
                          placeholder="소개"
                        />
                        <button
                          onClick={() => removeProducer(producer.id)}
                          className="border border-rose-300 px-3 py-1.5 text-xs text-rose-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'cabinet' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900">지식 수정/추가</h3>
                    <button
                      onClick={addCabinetItem}
                      className="border border-zinc-300 px-3 py-2 text-xs text-zinc-700"
                    >
                      지식 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {content.cabinetItems.map((item) => (
                      <div key={item.id} className="space-y-2 border border-zinc-300 p-3">
                        <input
                          value={item.title}
                          onChange={(event) =>
                            updateCabinetItem(item.id, (current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="제목"
                        />
                        <input
                          value={item.subtitle ?? ''}
                          onChange={(event) =>
                            updateCabinetItem(item.id, (current) => ({
                              ...current,
                              subtitle: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="부제"
                        />
                        <input
                          value={item.author}
                          onChange={(event) =>
                            updateCabinetItem(item.id, (current) => ({
                              ...current,
                              author: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="작성자"
                        />
                        <input
                          value={item.location ?? ''}
                          onChange={(event) =>
                            updateCabinetItem(item.id, (current) => ({
                              ...current,
                              location: event.target.value,
                            }))
                          }
                          className="w-full border border-zinc-300 px-3 py-2 text-sm"
                          placeholder="위치"
                        />
                        <textarea
                          value={item.description ?? ''}
                          onChange={(event) =>
                            updateCabinetItem(item.id, (current) => ({
                              ...current,
                              description: event.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full border border-zinc-300 px-3 py-2 text-sm leading-6"
                          placeholder="설명"
                        />
                        <button
                          onClick={() => removeCabinetItem(item.id)}
                          className="border border-rose-300 px-3 py-1.5 text-xs text-rose-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

