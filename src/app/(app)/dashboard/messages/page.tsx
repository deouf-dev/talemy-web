"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Send, Check, X, Loader2, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useMyConversations,
  useConversationMessages,
  useSendMessage,
  useMyContactRequests,
  useUpdateContactRequestStatus,
  useDeleteContactRequest,
} from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";
import { useSocket } from "@/lib/socket/SocketProvider";
import { ProposeLessonDialog } from "@/components/chat/ProposeLessonDialog";

export default function MessagesPage() {
  const { user } = useAuth();
  const {
    isConnected,
    joinConversation,
    sendMessage: sendSocketMessage,
  } = useSocket();
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [showProposeLessonDialog, setShowProposeLessonDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationsData, isLoading: loadingConversations } =
    useMyConversations();
  const { data: requestsData } = useMyContactRequests("PENDING");
  const { data: messagesData, isLoading: loadingMessages } =
    useConversationMessages(selectedConversation, { page: 1, pageSize: 50 });

  const sendMessageMutation = useSendMessage();
  const updateRequestMutation = useUpdateContactRequestStatus();
  const deleteRequestMutation = useDeleteContactRequest();
  const [requestToCancel, setRequestToCancel] = useState<number | null>(null);

  const conversations = conversationsData?.conversations || [];
  const pendingRequests = requestsData?.contactRequests || [];
  const messages = messagesData?.messages || [];

  const isTeacher = user?.role === "TEACHER";

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations, selectedConversation]);

  // Rejoindre la conversation via socket quand on la sélectionne
  useEffect(() => {
    if (selectedConversation && isConnected) {
      joinConversation(selectedConversation);
    }
  }, [selectedConversation, isConnected, joinConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const messageContent = messageInput;
    setMessageInput("");

    try {
      // Envoyer via socket pour la mise à jour en temps réel
      if (isConnected) {
        sendSocketMessage(selectedConversation, messageContent);
      } else {
        // Fallback à l'API HTTP si socket non connecté
        await sendMessageMutation.mutateAsync({
          conversationId: selectedConversation,
          content: messageContent,
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remettre le message en cas d'erreur
      setMessageInput(messageContent);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await updateRequestMutation.mutateAsync({
        requestId,
        status: "ACCEPTED",
      });
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await updateRequestMutation.mutateAsync({
        requestId,
        status: "REJECTED",
      });
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const handleCancelRequest = () => {
    if (!requestToCancel) return;

    deleteRequestMutation.mutate(requestToCancel, {
      onSuccess: () => {
        setRequestToCancel(null);
      },
      onError: (error) => {
        console.error("Failed to cancel request:", error);
      },
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Messages</h2>
          <p className="text-muted-foreground">Gérez vos conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "En ligne" : "Hors ligne"}
          </span>
        </div>
      </div>

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Demandes en attente
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => {
                // Pour les professeurs, afficher l'étudiant
                // Pour les étudiants, afficher le professeur
                const displayName = isTeacher
                  ? request.student
                    ? `${request.student.name} ${request.student.surname}`
                    : "Élève"
                  : request.teacher
                    ? `${request.teacher.name} ${request.teacher.surname}`
                    : "Professeur";

                const initials = isTeacher
                  ? request.student
                    ? `${request.student.name[0]}${request.student.surname[0]}`
                    : "?"
                  : request.teacher
                    ? `${request.teacher.name[0]}${request.teacher.surname[0]}`
                    : "?";

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isTeacher ? (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={updateRequestMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={updateRequestMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRequestToCancel(request.id)}
                          disabled={deleteRequestMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Annuler la demande
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversations actives */}
      <div className="grid grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingConversations ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucune conversation
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedConversation === conv.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {conv.partner.name[0]}
                          {conv.partner.surname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold truncate">
                            {conv.partner.name} {conv.partner.surname}
                          </p>
                        </div>
                        {conv.lastMessage && (
                          <>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(conv.lastMessage.createdAt)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <Card className="col-span-2">
          <CardHeader>
            {selectedConv && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConv.partner.name[0]}
                      {selectedConv.partner.surname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {selectedConv.partner.name} {selectedConv.partner.surname}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.partner.email}
                    </p>
                  </div>
                </div>
                {isTeacher && (
                  <Button
                    onClick={() => setShowProposeLessonDialog(true)}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Proposer un cours
                  </Button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedConv ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                      Aucun message pour le moment
                    </div>
                  ) : (
                    <>
                      {messages
                        .slice()
                        .reverse()
                        .map((message) => {
                          const isMe = message.senderUserId === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {isMe
                                    ? "Moi"
                                    : `${selectedConv.partner.name[0]}${selectedConv.partner.surname[0]}`}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`p-3 rounded-lg max-w-md ${
                                  isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background border"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isMe
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input de réponse */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Écrivez votre message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !messageInput.trim() || sendMessageMutation.isPending
                    }
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour proposer un cours */}
      {selectedConv && (
        <ProposeLessonDialog
          open={showProposeLessonDialog}
          onOpenChange={setShowProposeLessonDialog}
          studentUserId={selectedConv.partner.id}
          studentName={`${selectedConv.partner.name} ${selectedConv.partner.surname}`}
        />
      )}

      {/* Dialog de confirmation d'annulation */}
      <Dialog
        open={requestToCancel !== null}
        onOpenChange={() => setRequestToCancel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la demande de contact</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette demande de contact ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRequestToCancel(null)}
              disabled={deleteRequestMutation.isPending}
            >
              Non, garder
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
              disabled={deleteRequestMutation.isPending}
            >
              {deleteRequestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                "Oui, annuler"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
